import { createEntityAdapter } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';
import { placesEntityMetadata } from './entity-metadata';
import { Place } from './place.model';

const adaptor = createEntityAdapter(placesEntityMetadata);
const selectors = adaptor.getSelectors();

const selectFeatured = createSelector(
  selectors.selectAll,
  entities => entities[0] ?? null
);

const selectNonFeatured = createSelector(
  selectors.selectAll,
  selectFeatured,
  (all, featured) => all.filter(e => e !== featured)
);

const selectBookable = createSelector(
  selectors.selectAll,
  (all: Place[], props: { currentUserId: string }) => all.filter(e => e.userId !== props.currentUserId)
);

const selectBookableFeatured = createSelector(
  selectBookable,
  selectFeatured,
  (bookable: Place[], featured) => bookable.includes(featured) ? featured : null
);

const selectBookableNonFeatured = createSelector(
  selectBookable,
  selectFeatured,
  (bookable: Place[], featured) => bookable.filter(e => e !== featured)
);

export const placesSelectors = {
  ...selectors,
  selectFeatured,
  selectNonFeatured,
  selectBookable,
  selectBookableFeatured,
  selectBookableNonFeatured
};
