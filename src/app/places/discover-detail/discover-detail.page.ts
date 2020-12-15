import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, withLatestFrom } from 'rxjs/operators';
import { CreateBookingComponent, selectionMode } from '../../booking/create-booking/create-booking.component';
import { BookingEntityService } from '../../booking/shared';
import { MapModalComponent } from '../../common-ui';
import { Place, PlaceEntityService } from '../../places-state';

interface ComponentState {
  entity: Place | undefined;
  isBookable: boolean;
}

const initialState: ComponentState = {
  entity: undefined,
  isBookable: false
};

@Component({
  templateUrl: './discover-detail.page.html',
  styleUrls: ['./discover-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscoverDetailPage extends RxState<ComponentState> {

  vm$: Observable<ComponentState>;

  constructor(
    route: ActivatedRoute,
    entityService: PlaceEntityService,
    private bookingEntityService: BookingEntityService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController) {
    super();

    this.set(initialState);

    const entity$ = route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => entityService.entityById$(id)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.connect('entity', entity$);

    const isBookable$ = entity$.pipe(
      withLatestFrom(entityService.bookable$),
      map(([entity, bookable]) => bookable.includes(entity))
    );
    this.connect('isBookable', isBookable$);

    this.vm$ = this.select();
  }

  async onBook(entity: Place) {
    const actionSheet = await this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal(entity, 'select');
            }
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal(entity, 'random');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
    await actionSheet.present();
  }

  async onShowFullMap(entity: Place) {
    const modal = await this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: entity.location.lat,
            lng: entity.location.lng
          },
          selectable: false,
          closeButtonText: 'Close',
          title: entity.location.address
        }
      });
    await modal.present();
  }

  private async openBookingModal(entity: Place, mode: selectionMode) {
    const modal = await this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: entity, selectedMode: mode }
      });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm') {
      this.bookingEntityService.save(data.newBooking);
    }
  }
}
