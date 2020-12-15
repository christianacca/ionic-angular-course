import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { PlaceEntityService } from './place-entity.service';

@Injectable({ providedIn: 'root' })
export class PlacesResolver implements Resolve<boolean> {
  constructor(private entityService: PlaceEntityService) {
  }

  resolve(): Observable<boolean> {
    return this.entityService.loadAll();
  }
}
