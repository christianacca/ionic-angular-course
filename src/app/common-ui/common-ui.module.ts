import { NgModule } from '@angular/core';
import { CameraModule } from './camera';
import { GoogleMapsModule } from './google-maps';

const LIBS = [CameraModule, GoogleMapsModule];

@NgModule({
  imports: LIBS,
  exports: LIBS
})
export class CommonUiModule { }
