import { EntityBase } from 'src/app/core';

export interface Booking extends EntityBase {
  placeId: string;
  firstName: string;
  lastName: string;
  guestNumber: number;
  bookedFrom: string;
  bookedTo: string;
}
