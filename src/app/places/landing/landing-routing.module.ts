import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacesResolver } from '../../places-state';
import { LandingPage } from './landing.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: LandingPage,
    resolve: {
      places: PlacesResolver
    },
    children: [
      {
        path: 'discover',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadChildren: () => import('../discover-list/discover-list.module').then(m => m.DiscoverListPageModule)
          },
          {
            path: ':id',
            loadChildren: () => import('../discover-detail/discover-detail.module').then(m => m.DiscoverDetailPageModule)
          },
          {
            path: '',
            redirectTo: '/places/tabs/discover',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'offers',
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadChildren: () => import('../offers-list/offers-list.module').then(m => m.OffersListPageModule)
          },
          {
            path: 'new',
            loadChildren: () => import('../offers-new/offers-new.module').then(m => m.OffersNewPageModule)
          },
          {
            path: 'edit/:id',
            loadChildren: () => import('../offers-edit/offers-edit.module').then(m => m.OffersEditPageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/places/tabs/discover'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule { }
