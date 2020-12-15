import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacesResolver } from '../../places-state';
import { BookingsResolver } from '../shared';
import { LandingPage } from './landing.page';


const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    resolve: {
      bookings: BookingsResolver,
      places: PlacesResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule { }
