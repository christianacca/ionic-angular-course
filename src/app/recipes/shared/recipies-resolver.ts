import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeEntityService } from './recipes-entity.service';

@Injectable({ providedIn: 'root' })
export class RecipiesResolver implements Resolve<boolean> {
  constructor(private entityService: RecipeEntityService) {
  }

  resolve(): Observable<boolean> {
    return this.entityService.loadAll();
  }
}
