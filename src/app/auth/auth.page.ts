import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html'
})
export class AuthPage {
  isLogin = true;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  async authenticate(email: string, password: string) {
    const loading = await this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' });
    await loading.present();

    const authObs = this.isLogin ?
      this.authService.login(email, password) :
      this.authService.signup(email, password);

    return await authObs.toPromise().then(
      () => {
        loading.dismiss();
        this.navCtrl.navigateRoot('/places/tabs/discover');
      },
      (errRes) => {
        loading.dismiss();
        const code = errRes.error.error.message;
        let message = 'Could not sign you up, please try again.';
        if (code === 'EMAIL_EXISTS') {
          message = 'This email address exists already!';
        } else if (code === 'EMAIL_NOT_FOUND' || code === 'INVALID_PASSWORD') {
          message = 'Email or password is not correct';
        }
        return this.showAlert(message);
      }
    );
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { email, password } = form.value;
    await this.authenticate(email, password);
  }

  private async showAlert(message: string) {
    // note: we're having to wrap the alert in our own promise
    // to ensure that the alert is not a "fire-and-forget" but
    // will block execution of the remaining promise chain
    // until the user clicks on the 'Okay' button
    return new Promise<void>(async (resolve) => {
      const alert = await this.alertCtrl
        .create({
          header: 'Authentication failed',
          message,
          buttons: [{
            text: 'Okay',
            role: 'cancel',
            handler: resolve,
          }]
        });
      await alert.present();
    });
  }
}
