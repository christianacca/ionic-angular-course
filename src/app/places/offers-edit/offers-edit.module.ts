import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OffersEditPageRoutingModule } from './offers-edit-routing.module';
import { OffersEditPage } from './offers-edit.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    OffersEditPageRoutingModule
  ],
  declarations: [OffersEditPage]
})
export class OffersEditPageModule { }
