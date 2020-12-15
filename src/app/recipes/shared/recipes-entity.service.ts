import { Injectable } from '@angular/core';
import { EntityCollectionService } from '../../entity';
import { Recipe } from './models';
import { RecipesDataService } from './recipes-data.service';

@Injectable({ providedIn: 'root' })
export class RecipeEntityService extends EntityCollectionService<Recipe> {
  constructor(dataService: RecipesDataService) {
    super(dataService, { sortComparer: (left, right) => left.title.localeCompare(right.title) });
  }
}
