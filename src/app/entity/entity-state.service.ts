import { InjectionToken } from '@angular/core';
import { Comparer, createEntityAdapter, Dictionary, EntityAdapter, IdSelector } from '@ngrx/entity';
import { select as ngrxSelect } from '@ngrx/store';
import { RxState, select } from '@rx-angular/state';
import { isObservable, merge, Observable, of, Subject } from 'rxjs';
import { exhaustMap, filter, map, mapTo, mergeMap, shareReplay, take, withLatestFrom } from 'rxjs/operators';
import { EntityDataService } from './entity-data.service';
import { EntityId, EntityState } from './entity-state';
import { isHttpError, toHttpResult } from './http-result';
import { switchMapByKey } from './switch-map-by-key';

export type EntityDefaultsFactory<T> = (entity: T) => Observable<T> | T;
export const ENTITY_DEFAULTS_FACTORY_TOKEN = new InjectionToken<EntityDefaultsFactory<any>>('EntityDefaultsFactory');

export interface EntityMetadata<T> {
  defaultsFactory?: EntityDefaultsFactory<T>;
  selectId?: IdSelector<T>;
  sortComparer?: false | Comparer<T>;
}

export interface LoadOptions {
  /**
   * Fetch from server even when already loaded
   * Defaults to `false`
   */
  force: boolean;
}

export const defaultLoadoptions: LoadOptions = {
  force: false
};

const loadingResult = <T>() => (source$: Observable<EntityState<T>>) => source$.pipe(
  select('loading'),
  filter(loading => !loading),
  withLatestFrom(source$, (_, state) => state.error == null),
  take(1)
);

const catchEntityCrudError = <T>(entity: T) => (source$: Observable<any>) => source$.pipe(
  toHttpResult(),
  filter(isHttpError),
  map(({ error }) => ({ error, entity }))
);

export interface EntityCollectionService<T extends object> extends Pick<RxState<EntityState<T>>, 'get'> {
}

export abstract class EntityCollectionService<T extends object> {

  private adapter: EntityAdapter<T>;
  private state = new RxState<EntityState<T>>();

  entities$: Observable<T[]>;
  entityMap$: Observable<Dictionary<T>>;
  error$ = this.state.select('error');
  loaded$ = this.state.select('loaded');
  loading$ = this.state.select('loading');
  state$ = this.state.select();

  private addCmd = new Subject<T>();
  private clearCmd = new Subject();
  private deleteCmd = new Subject<T>();
  private updateCmd = new Subject<T>();
  private fetchAllCmd = new Subject();

  constructor(
    private dataService: EntityDataService<T>,
    private metadata: EntityMetadata<T> = {}) {

    this.adapter = createEntityAdapter<T>(metadata);

    const {
      selectEntities,
      selectAll
    } = this.adapter.getSelectors();

    const initialState: EntityState<T> = this.adapter.getInitialState({
      loaded: false,
      loading: false,
      error: undefined
    });

    this.state.set(initialState);

    this.connectAddCommand();
    this.connectDeleteCommand();
    this.connectLoadAllCommand();
    this.connectUpdateCommand();

    const loading$ = merge(this.fetchAllCmd);
    this.state.connect(loading$.pipe(mapTo({ loading: true, error: undefined })));

    this.state.connect(this.clearCmd.pipe(mapTo(initialState)));

    this.entities$ = this.state.select(ngrxSelect(selectAll));
    this.entityMap$ = this.state.select(ngrxSelect(selectEntities));

    this.get = this.state.get.bind(this.state);
  }



  clearCache() {
    this.clearCmd.next();
  }

  add(entity: T) {
    if (this.dataService.add == null) {
      throw new Error('The `EntityDataService` supplied does not implement add');
    }

    this.addCmd.next(entity);
  }

  delete(entity: T) {
    if (this.dataService.delete == null) {
      throw new Error('The `EntityDataService` supplied does not implement delete');
    }

    this.deleteCmd.next(entity);
  }

  entityById$(id: EntityId): Observable<T | undefined> {
    return this.state.select('entities', id);
  }

  loadAll(options?: Partial<LoadOptions>): Observable<boolean> {

    const { force } = { ...defaultLoadoptions, ...options };
    const { loaded, error } = this.state.get();
    if (!force && loaded && !error) {
      return of(true);
    }

    this.fetchAllCmd.next();
    return this.state.$.pipe(loadingResult());
  }

  save(entity: T) {
    const id = this.adapter.selectId(entity);
    const originalEntity = id && this.state.get('entities')[id];
    if (originalEntity == null) {
      this.add(entity);
    } else {
      this.update(entity);
    }
  }

  update(entity: T) {
    if (this.dataService.update == null) {
      throw new Error('The `EntityDataService` supplied does not implement update');
    }

    this.updateCmd.next(entity);
  }

  private connectAddCommand() {

    const { defaultsFactory } = this.metadata;
    const entityInsert$ = defaultsFactory ?
      this.addCmd.pipe(
        mergeMap(entity => {
          const enrichedEntity = defaultsFactory(entity);
          return isObservable(enrichedEntity) ? enrichedEntity.pipe(take(1)) : of(enrichedEntity);
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      ) :
      this.addCmd.asObservable();

    // optimistically add entity to state
    this.state.connect(entityInsert$,
      (state, entity) => this.adapter.addOne(entity, state)
    );

    // execute add on server, undoing state change on error
    const error$ = entityInsert$.pipe(
      mergeMap(entity => this.dataService.add(entity).pipe(catchEntityCrudError(entity)))
    );
    this.state.connect(error$,
      (state, { error, entity }) => this.adapter.removeOne(this.adapter.selectId(entity) as string, { ...state, error })
    );
  }

  private connectDeleteCommand() {

    // optimistically remove entity from state
    this.state.connect(this.deleteCmd,
      (state, entity) => this.adapter.removeOne(this.adapter.selectId(entity) as string, state)
    );

    // execute delete, undoing state change on error
    const error$ = this.deleteCmd.pipe(
      mergeMap(entity => this.dataService.delete(entity).pipe(catchEntityCrudError(entity)))
    );
    this.state.connect(error$,
      (state, { error, entity }) => this.adapter.addOne(entity, { ...state, error })
    );
  }

  private connectUpdateCommand() {

    // execute update, undoing state change on error
    const httpConnectionTimeoutMs = 15000;
    const error$ = this.updateCmd.pipe(
      map(entity => ({
        entity,
        originalEntity: this.state.get('entities')[this.adapter.selectId(entity)]
      })),
      switchMapByKey(
        ({ entity }) => this.adapter.selectId(entity),
        ({ entity, originalEntity }) => this.dataService.update(entity).pipe(catchEntityCrudError(originalEntity)),
        httpConnectionTimeoutMs
      )
    );
    this.state.connect(error$,
      (state, { error, entity: originalEntity }) => this.adapter.updateOne(
        { id: this.adapter.selectId(originalEntity) as string, changes: originalEntity },
        { ...state, error })
    );

    // optimistically update entity in state
    this.state.connect(this.updateCmd,
      (state, entity) => this.adapter.updateOne(
        { id: this.adapter.selectId(entity) as string, changes: entity },
        state
      )
    );
  }

  private connectLoadAllCommand() {
    const fetchedAll$ = this.fetchAllCmd.pipe(
      exhaustMap(() => this.dataService.getAll().pipe(toHttpResult()))
    );
    this.state.connect(fetchedAll$, (state, result) => isHttpError(result) ?
      { error: result.error, loading: false } :
      this.adapter.setAll(result.data, { ...state, loading: false, loaded: true })
    );
  }
}
