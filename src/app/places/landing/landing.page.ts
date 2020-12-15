import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  templateUrl: './landing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPage {

  isMobile = this.platform.is('mobile');

  constructor(private platform: Platform) {
  }

}
