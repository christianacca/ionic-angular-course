import { EntityMetadata } from 'src/app/entity';
import { Place } from './place.model';

export const placesEntityMetadata: EntityMetadata<Place> =
  { sortComparer: (left, right) => left.title.localeCompare(right.title) };
