import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImagePickerComponent } from './image-picker/image-picker.component';

const PUBLIC_COMPONENTS = [ImagePickerComponent];

@NgModule({
  imports: [CommonModule, IonicModule],
  exports: [PUBLIC_COMPONENTS],
  declarations: [PUBLIC_COMPONENTS],
  providers: [],
})
export class CameraModule { }
