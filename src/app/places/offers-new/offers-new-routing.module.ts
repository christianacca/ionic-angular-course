import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffersNewPage } from './offers-new.page';

const routes: Routes = [
  {
    path: '',
    component: OffersNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersNewPageRoutingModule {}
