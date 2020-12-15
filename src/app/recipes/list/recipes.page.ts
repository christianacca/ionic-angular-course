import { Component } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorAlertService } from 'src/app/core';
import { Recipe, RecipeEntityService } from '../shared';

interface ViewModel {
  entities: Recipe[];
}
@Component({
  templateUrl: 'recipes.page.html'
})
export class RecipesPage extends RxState<any> {

  vm$: Observable<ViewModel>;

  constructor(entityService: RecipeEntityService, errorAlert: ErrorAlertService) {
    super();

    this.vm$ = entityService.entities$.pipe(
      map(entities => ({ entities }))
    );

    this.hold(entityService.error$, (async (err) => await errorAlert.showError(err)));
  }
}
