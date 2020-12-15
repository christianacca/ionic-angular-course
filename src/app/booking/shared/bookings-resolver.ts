import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { BookingEntityService } from './booking-entity.service';

@Injectable({ providedIn: 'root' })
export class BookingsResolver implements Resolve<boolean> {
  constructor(private entityService: BookingEntityService) {
  }

  resolve(): Observable<boolean> {
    return this.entityService.loadAll();
  }
}
