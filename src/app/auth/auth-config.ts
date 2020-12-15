import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthConfig {
  autoLogoutEnabled = true;
  redirectUrlAfterLogout = '/auth';
}
