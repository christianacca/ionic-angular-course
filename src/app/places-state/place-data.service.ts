import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth';
import { FirebaseDataService } from '../core';
import { Place } from './place.model';

@Injectable({ providedIn: 'root' })
export class PlaceDataService extends FirebaseDataService<Place> {

  constructor(http: HttpClient, authService: AuthService) {
    super(http, authService, 'offered-places');
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.token$.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{ imageUrl: string; imagePath: string }>(
          'https://us-central1-cc-ionic-angular-course.cloudfunctions.net/storeImage',
          uploadData,
          { headers: { Authorization: 'Bearer ' + token } }
        );
      })
    );
  }
}
