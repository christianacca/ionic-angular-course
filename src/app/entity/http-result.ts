import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface HttpSuccess<T> {
  data: T;
}

export interface HttpError {
  error: any;
}

export type HttpResult<T> = HttpSuccess<T> | HttpError;

export const toHttpResult = <T>() => (source$: Observable<T>): Observable<HttpResult<T>> => source$.pipe(
  map(data => ({ data })),
  catchError(error => of({ error }))
);

export const isHttpError = <T>(value: HttpResult<T>): value is HttpError => (value as HttpError).error != null;
