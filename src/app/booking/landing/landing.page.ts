import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { select as ngrxSelect } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { Place, PlaceEntityService } from 'src/app/places-state';
import { EntityState } from '../../entity';
import { BookedPlace, bookedPlaceSelectors, Booking, BookingEntityService } from '../shared';

interface PlaceBookingState {
  bookings: EntityState<Booking>;
  places: EntityState<Place>;
}

@Component({
  templateUrl: './landing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPage extends RxState<PlaceBookingState> {

  items$: Observable<BookedPlace[]>;

  constructor(
    private entityService: BookingEntityService,
    placesEntityService: PlaceEntityService) {
    super();

    // set initial state
    this.set({
      bookings: entityService.get(),
      places: placesEntityService.get()
    });

    this.connect('bookings', entityService.state$);
    this.connect('places', placesEntityService.state$);

    this.items$ = this.select(ngrxSelect(bookedPlaceSelectors.selectAll));

  }

  cancelBooking(entity: Booking, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.entityService.delete(entity);
  }
}
