import { createEntityAdapter } from '@ngrx/entity';
import { bookingEntityMetadata } from './entity-metadata';

const adapter = createEntityAdapter(bookingEntityMetadata);
export const bookingSelectors = adapter.getSelectors();

