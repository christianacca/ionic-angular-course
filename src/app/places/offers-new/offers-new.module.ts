import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonUiModule } from '../../common-ui';
import { OffersNewPageRoutingModule } from './offers-new-routing.module';
import { OffersNewPage } from './offers-new.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    OffersNewPageRoutingModule,
    CommonUiModule
  ],
  declarations: [OffersNewPage]
})
export class OffersNewPageModule { }
