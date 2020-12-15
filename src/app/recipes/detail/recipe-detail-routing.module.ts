import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipiesResolver } from '../shared/recipies-resolver';
import { RecipeDetailPage } from './recipe-detail.page';


const routes: Routes = [
  {
    path: '',
    component: RecipeDetailPage,
    resolve: {
      recipies: RecipiesResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeDetailPageRoutingModule { }
