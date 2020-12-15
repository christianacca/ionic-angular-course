import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Place, PlaceEntityService } from '../../places-state';

@Component({
  templateUrl: './offers-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    ion-item-option > ion-icon {
      pointer-events: none;
    }
  `]
})
export class OffersListPage {

  entities$: Observable<Place[]>;

  constructor(entityService: PlaceEntityService) {
    this.entities$ = entityService.entities$;
  }
}
