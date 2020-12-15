import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverDetailPage } from './discover-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DiscoverDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscoverDetailPageRoutingModule {}
