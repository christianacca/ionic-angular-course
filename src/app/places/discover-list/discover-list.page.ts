import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Place, PlaceEntityService } from '../../places-state';

interface ComponentState {
  nonFeaturedPlaces: Place[];
  featuredPlace: Place | null;
}

const initialstate: ComponentState = {
  nonFeaturedPlaces: [],
  featuredPlace: null
};

@Component({
  templateUrl: './discover-list.page.html',
  styles: [`
    ion-card ion-img::part(image) {
      max-height: 300px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscoverListPage extends RxState<ComponentState> {

  bookableFilter = new BehaviorSubject<boolean>(false);
  vm$: Observable<ComponentState>;

  private bookableFilter$ = this.bookableFilter.pipe(distinctUntilChanged());

  constructor(entityService: PlaceEntityService) {
    super();

    this.set(initialstate);
    this.connect('featuredPlace', this.bookableFilter$.pipe(
      switchMap(bookableOnly => bookableOnly ? entityService.bookableFeatured$ : entityService.featured$))
    );
    this.connect('nonFeaturedPlaces', this.bookableFilter$.pipe(
      switchMap(bookableOnly => bookableOnly ? entityService.bookableNonFeatured$ : entityService.nonFeatured$))
    );
    this.vm$ = this.select();
  }
}
