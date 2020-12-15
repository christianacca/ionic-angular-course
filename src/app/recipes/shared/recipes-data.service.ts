import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { ErrorDetail } from 'src/app/core';
import { EntityDataService } from '../../entity';
import { Recipe } from './models';

@Injectable({ providedIn: 'root' })
export class RecipesDataService implements EntityDataService<Recipe> {

  fakeDb: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Schnitzel.JPG/1024px-Schnitzel.JPG',
      ingredients: ['French Fries', 'Pork Meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg/1024px-Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
    },
    {
      id: 'r3',
      title: 'Spag bol',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg/1024px-Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes', 'Mushrooms']
    },
    {
      id: 'r4',
      title: 'Carrots',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Schnitzel.JPG/1024px-Schnitzel.JPG',
      ingredients: ['Carrot']
    }
  ];

  delete(entity: Recipe) {
    const simulateError = Math.random() > 0.5;
    // simulate fetching over http
    return of(entity).pipe(
      delay(2000),
      tap(() => {
        if (simulateError) {
          const err: ErrorDetail = new Error('Internal Server Error');
          err.detail = `Problem deleting Recipe ('${entity.title}')`;
          throw err;
        }
        this.fakeDb = this.fakeDb.filter(e => e.id !== entity.id);
      })
    );
  }

  getAll(): Observable<Recipe[]> {
    // simulate fetching over http
    return of(this.fakeDb).pipe(delay(1000));
  }
}
