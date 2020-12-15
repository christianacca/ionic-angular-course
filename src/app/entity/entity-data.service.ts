import { Observable } from 'rxjs';

export abstract class EntityDataService<T> {

  abstract delete?(entity: T): Observable<T>;
  abstract update?(entity: T): Observable<T>;
  abstract add?(entity: T): Observable<T>;

  abstract getAll(): Observable<T[]>;
}
