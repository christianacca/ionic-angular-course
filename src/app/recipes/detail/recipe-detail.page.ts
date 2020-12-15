import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Recipe, RecipeEntityService } from '../shared';

interface ViewModel {
  entity: Recipe;
}

@Component({
  templateUrl: 'recipe-detail.page.html',
  styleUrls: ['recipe-detail.page.scss']
})
export class RecipeDetailPage {

  vm$: Observable<ViewModel>;
  constructor(private entityService: RecipeEntityService, route: ActivatedRoute, private router: Router) {

    const entity$ = route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => entityService.entityById$(id))
    );

    this.vm$ = combineLatest([entity$]).pipe(
      map(([entity]) => ({ entity }))
    );
  }

  delete(entity: Recipe) {
    this.entityService.delete(entity);
    this.router.navigateByUrl('/recipes');
  }

}
