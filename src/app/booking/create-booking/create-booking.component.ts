import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from '../../places-state/place.model';
import { Booking } from '../shared';

export type selectionMode = 'select' | 'random';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: selectionMode;

  @ViewChild('f', { static: true }) form: NgForm;

  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
        Math.random() *
        (availableTo.getTime() -
          7 * 24 * 60 * 60 * 1000 -
          availableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
        Math.random() *
        (new Date(this.startDate).getTime() +
          6 * 24 * 60 * 60 * 1000 -
          new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace() {
    const newBooking: Booking = {
      ...this.form.value,
      placeId: this.selectedPlace.id
    };
    this.modalCtrl.dismiss({ newBooking }, 'confirm');
  }

  datesValid() {
    const startDate = new Date(this.form.value.bookedFrom);
    const endDate = new Date(this.form.value.bookedTo);
    return endDate > startDate;
  }
}
