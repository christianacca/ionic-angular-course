import { EntityBase } from '../core';
import { PlaceLocation } from './location.model';

export interface Place extends EntityBase {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: string;
  availableTo: string;
  location: PlaceLocation;
}
