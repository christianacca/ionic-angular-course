import { EntityState as NgrxEntityState } from '@ngrx/entity';

export type EntityId = string | number;

export const isEntityId = (value: any): value is EntityId => typeof value === 'string' || typeof value === 'number';

export interface EntityState<T> extends NgrxEntityState<T> {
  loaded: boolean;
  loading: boolean;
  error?: any;
}
