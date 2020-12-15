import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RecipeDetailPageRoutingModule } from './recipe-detail-routing.module';
import { RecipeDetailPage } from './recipe-detail.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RecipeDetailPageRoutingModule
  ],
  declarations: [RecipeDetailPage]
})
export class RecipeDetailPageModule { }
