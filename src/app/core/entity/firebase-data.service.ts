import { HttpClient } from '@angular/common/http';
import { Dictionary } from '@ngrx/entity';
import { Observable, of } from 'rxjs';
import { map, mapTo, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth';
import { EntityDataService } from '../../entity';
import { EntityBase } from './entity-base';

export class FirebaseDataService<T extends EntityBase> implements EntityDataService<T> {

  baseUrl = 'https://cc-ionic-angular-course-default-rtdb.firebaseio.com';
  collectionUrl = `${this.baseUrl}/${this.collectionPath}`;

  constructor(protected http: HttpClient, protected authService: AuthService, private collectionPath: string) { }

  getAll(): Observable<T[]> {
    const url$ = this.getFullUrl(`${this.collectionUrl}.json`, this.getAllFilteredUrl.bind(this));
    return url$.pipe(switchMap(url =>
      this.http.get<Dictionary<T>>(url).pipe(map(Object.values))
    ));
  }

  protected getAllFilteredUrl(): Observable<string> {
    return of('');
  }

  add(entity: T) {
    return this.put(entity);
  }

  delete(entity: T) {
    const url$ = this.getFullUrl(`${this.collectionUrl}/${entity.id}.json`);
    return url$.pipe(switchMap(url =>
      this.http.delete(url).pipe(mapTo(entity)))
    );
  }

  update(entity: T) {
    return this.put(entity);
  }

  private addAuthToken(url: string) {
    return this.authService.token$.pipe(map(token => `${url}?auth=${token}`));
  }

  private getFullUrl(resourceUrl: string, queryParamsFactory?: () => Observable<string>) {
    return of(resourceUrl).pipe(
      switchMap(url => this.addAuthToken(url)),
      switchMap(url => {
        return queryParamsFactory ? queryParamsFactory()
          .pipe(map(queryString => queryString ? `${url}&${queryString}` : url)) :
          of(url);
      }),
      take(1)
    );
  }

  private put(entity: T) {
    const url$ = this.getFullUrl(`${this.collectionUrl}/${entity.id}.json`);
    return url$.pipe(switchMap(url =>
      this.http.put(url, entity).pipe(mapTo(entity)))
    );
  }
}
