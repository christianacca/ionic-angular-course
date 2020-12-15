import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Capacitor, Plugins } from '@capacitor/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Coordinates, PlaceLocation } from '../../../places-state';
import { MapModalComponent } from '../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  selectedLocationImage: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController) { }

  ngOnInit() { }

  async onPickLocation() {
    const actionSheet = await this.actionSheetCtrl
      .create({
        header: 'Please Choose',
        buttons: [
          {
            text: 'Auto-Locate',
            handler: () => this.locateUser()
          },
          {
            text: 'Pick on Map',
            handler: () => this.openMap()
          },
          { text: 'Cancel', role: 'cancel' }
        ]
      });
    return actionSheet.present();
  }

  private async createPlaceLocation(coordinates: Coordinates) {
    const pickedLocation = await this.getAddress(coordinates).pipe(
      map<any, PlaceLocation>(address => ({
        ...coordinates,
        address,
        staticMapImageUrl: this.getMapImage(coordinates, 14)
      }))
    ).toPromise();
    this.selectedLocationImage = pickedLocation.staticMapImageUrl;
    this.locationPick.emit(pickedLocation);
  }

  private getAddress({ lat, lng }: Coordinates) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleApiKey
        }`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage({ lat, lng }: Coordinates, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleApiKey}`;
  }

  private async locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      return this.showErrorAlert();
    }

    try {
      this.isLoading = true;
      const geoPosition = await Plugins.Geolocation.getCurrentPosition();
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      await this.createPlaceLocation(coordinates);
    } catch {
      await this.showErrorAlert();
    }
    finally {
      this.isLoading = false;
    }
  }

  private async openMap() {
    const modal = await this.modalCtrl.create({ component: MapModalComponent });
    await modal.present();
    const modalData = await modal.onDidDismiss();

    if (!modalData.data) {
      return;
    }

    const coordinates: Coordinates = {
      lat: modalData.data.lat,
      lng: modalData.data.lng
    };
    try {
      this.isLoading = true;
      await this.createPlaceLocation(coordinates);
    } finally {
      this.isLoading = false;
    }
  }

  private async showErrorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location!',
      buttons: ['Okay']
    });
    return alert.present();
  }
}
