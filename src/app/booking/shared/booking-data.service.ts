import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth';
import { FirebaseDataService } from '../../core';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingDataService extends FirebaseDataService<Booking> {

  constructor(http: HttpClient, authService: AuthService) {
    super(http, authService, 'bookings');
  }

  getAllFilteredUrl() {
    return this.authService.userId$.pipe(map(userId => `orderBy="userId"&equalTo="${userId}"`));
  }
}
