import { EntityMetadata } from 'src/app/entity';
import { Booking } from './booking.model';

export const bookingEntityMetadata: EntityMetadata<Booking> =
  { sortComparer: (left, right) => left.bookedFrom.localeCompare(right.bookedFrom) };
