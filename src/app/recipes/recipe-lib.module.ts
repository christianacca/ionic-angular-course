import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./list/recipes.module').then(m => m.RecipesPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./detail/recipe-detail.module').then(m => m.RecipeDetailPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class RecipeLibModule { }
