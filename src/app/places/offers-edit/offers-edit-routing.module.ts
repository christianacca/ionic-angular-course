import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffersEditPage } from './offers-edit.page';

const routes: Routes = [
  {
    path: '',
    component: OffersEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersEditPageRoutingModule {}
