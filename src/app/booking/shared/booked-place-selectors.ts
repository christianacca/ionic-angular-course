import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState } from '../../entity';
import { Place, placesSelectors } from '../../places-state';
import { BookedPlace } from './booked-place';
import { bookingSelectors } from './booking-selectors';
import { Booking } from './booking.model';

const bookingsFeatureSelector = createFeatureSelector<EntityState<Booking>>('bookings');
const placesFeatureSelector = createFeatureSelector<EntityState<Place>>('places');

const selectAllBooking = createSelector(
  bookingsFeatureSelector,
  bookingSelectors.selectAll
);

const selectPlacesMap = createSelector(
  placesFeatureSelector,
  placesSelectors.selectEntities
);

const selectAll = createSelector(
  selectAllBooking,
  selectPlacesMap,
  (bookings, placesMap) => bookings
    .filter(b => placesMap[b.placeId])
    .map<BookedPlace>(booking => {
      const place = placesMap[booking.placeId];
      return {
        booking,
        place
      };
    })
);

export const bookedPlaceSelectors = {
  selectAll
};
