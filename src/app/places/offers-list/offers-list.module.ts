import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OfferItemComponent } from '../offer-item/offer-item.component';
import { OffersListPageRoutingModule } from './offers-list-routing.module';
import { OffersListPage } from './offers-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffersListPageRoutingModule
  ],
  declarations: [OffersListPage, OfferItemComponent]
})
export class OffersListPageModule { }
