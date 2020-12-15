import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ErrorAlertService, isErrorDetail } from '../core';

@Injectable()
export class IonicErrorAlertService implements ErrorAlertService {
  constructor(private alertCtrl: AlertController) {

  }
  async showError(err: any): Promise<void> {

    const alertOptions = isErrorDetail(err) ? {
      header: 'Problem',
      subHeader: err.message,
      message: err.detail
    } : {
        header: 'Problem',
        message: err.message
      };

    const alert = await this.alertCtrl.create(alertOptions);
    await alert.present();
  }

}
