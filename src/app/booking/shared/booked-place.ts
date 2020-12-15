import { Place } from '../../places-state';
import { Booking } from './booking.model';

export interface BookedPlace {
  booking: Booking;
  place: Place;
}
