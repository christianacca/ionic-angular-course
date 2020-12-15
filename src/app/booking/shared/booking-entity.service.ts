import { Inject, Injectable } from '@angular/core';
import { EntityCollectionService, EntityDefaultsFactory, ENTITY_DEFAULTS_FACTORY_TOKEN } from '../../entity';
import { BookingDataService } from './booking-data.service';
import { Booking } from './booking.model';
import { bookingEntityMetadata } from './entity-metadata';

@Injectable({ providedIn: 'root' })
export class BookingEntityService extends EntityCollectionService<Booking> {
  constructor(
    @Inject(ENTITY_DEFAULTS_FACTORY_TOKEN) defaultsFactory: EntityDefaultsFactory<Booking>,
    dataService: BookingDataService) {
    super(dataService, { ...bookingEntityMetadata, defaultsFactory });
  }
}
