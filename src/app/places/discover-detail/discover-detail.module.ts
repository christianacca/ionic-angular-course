import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateBookingComponent } from '../../booking/create-booking/create-booking.component';
import { GoogleMapsModule } from '../../common-ui';
import { DiscoverDetailPageRoutingModule } from './discover-detail-routing.module';
import { DiscoverDetailPage } from './discover-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverDetailPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [DiscoverDetailPage, CreateBookingComponent]
})
export class DiscoverDetailPageModule { }
