import { EMPTY, Observable, OperatorFunction } from 'rxjs';
import { groupBy, ignoreElements, map, mergeAll, switchMap, timeoutWith } from 'rxjs/operators';

// for explanation of this operator see: https://www.youtube.com/watch?v=hsr4ArAsOL4
export function switchMapByKey<T, V>(
  keySelector: (item: T) => any,
  mapFn: (item: T) => Observable<V>,
  groupDuration: number,
): OperatorFunction<T, V> {
  return observable$ =>
    observable$.pipe(
      groupBy(
        keySelector,
        item => item,
        // prevent memory leak by cleaning-up groups after silence of `groupDuration`
        itemsByGroup$ =>
          itemsByGroup$.pipe(
            timeoutWith(groupDuration, EMPTY),
            ignoreElements()
          )
      ),
      map((itemGroup$: Observable<T>) => itemGroup$.pipe(switchMap(mapFn))),
      mergeAll()
    );
}
