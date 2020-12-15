import { Inject, Injectable } from '@angular/core';
import { select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth';
import { EntityCollectionService, EntityDefaultsFactory, ENTITY_DEFAULTS_FACTORY_TOKEN } from '../entity';
import { placesEntityMetadata } from './entity-metadata';
import { PlaceDataService } from './place-data.service';
import { placesSelectors } from './place-selectors';
import { Place } from './place.model';

@Injectable({ providedIn: 'root' })
export class PlaceEntityService extends EntityCollectionService<Place> {

  bookable$ = this.authService.userId$.pipe(
    switchMap(currentUserId => this.state$.pipe(select(placesSelectors.selectBookable, { currentUserId })))
  );
  bookableFeatured$ = this.authService.userId$.pipe(
    switchMap(currentUserId => this.state$.pipe(select(placesSelectors.selectBookableFeatured, { currentUserId })))
  );
  bookableNonFeatured$ = this.authService.userId$.pipe(
    switchMap(currentUserId => this.state$.pipe(select(placesSelectors.selectBookableNonFeatured, { currentUserId })))
  );
  featured$ = this.state$.pipe(select(placesSelectors.selectFeatured));
  nonFeatured$ = this.state$.pipe(select(placesSelectors.selectNonFeatured));

  constructor(
    private placeDataService: PlaceDataService,
    private authService: AuthService,
    @Inject(ENTITY_DEFAULTS_FACTORY_TOKEN) defaultsFactory: EntityDefaultsFactory<Place>) {
    super(placeDataService, { ...placesEntityMetadata, defaultsFactory });
  }

  uploadImage(image: File) {
    return this.placeDataService.uploadImage(image);
  }
}
