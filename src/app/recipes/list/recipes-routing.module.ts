import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipiesResolver } from '../shared';
import { RecipesPage } from './recipes.page';

const routes: Routes = [
  {
    path: '',
    resolve: {
      recipies: RecipiesResolver
    },
    component: RecipesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesPageRoutingModule { }
