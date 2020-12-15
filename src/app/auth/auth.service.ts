import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from, Subject, timer } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, skip, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthConfig } from './auth-config';
import { User } from './user';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

const storageKey = 'authData';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private user = new BehaviorSubject<User>(User.unauthenticated);
  readonly currentUser$ = this.user.asObservable();
  readonly userIsAuthenticated$ = this.currentUser$.pipe(pluck('hasValidToken'), distinctUntilChanged());

  readonly logins$ = this.userIsAuthenticated$.pipe(filter(isAuth => isAuth));
  readonly logouts$ = this.userIsAuthenticated$.pipe(
    skip(1), // we start out unauthenticated, so skip this emission
    filter(isAuth => !isAuth)
  );
  readonly token$ = this.currentUser$.pipe(pluck('token'));
  readonly userId$ = this.currentUser$.pipe(pluck('id'));

  private onDestroy = new Subject();

  constructor(private http: HttpClient, authConfig: AuthConfig, router: Router) {
    if (authConfig.redirectUrlAfterLogout) {
      this.enableAutoNavigationOnLogout(authConfig.redirectUrlAfterLogout, router);
    }
    if (authConfig.autoLogoutEnabled) {
      this.enableAutoLogout();
    }
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: storageKey })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const user = User.parse(storedData.value);
        if (!user.hasValidToken) {
          return null;
        }
        return user;
      }),
      tap(user => {
        if (user) {
          this.user.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }


  login(email: string, password: string) {
    return this.authenticate(email, password, 'signInWithPassword');
  }

  logout() {
    this.user.next(User.unauthenticated);
    Plugins.Storage.remove({ key: storageKey });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  signup(email: string, password: string) {
    return this.authenticate(email, password, 'signUp');
  }

  private authenticate(email: string, password: string, path: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:${path}?key=${environment.googleApiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  private enableAutoLogout() {
    const sessionTimeout$ = this.logins$.pipe(
      withLatestFrom(this.currentUser$, (_, user) => user.tokenDuration),
      switchMap(duration => timer(duration).pipe(
        take(1),
        takeUntil(this.logouts$)
      ))
    );
    sessionTimeout$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.logout());
  }

  private enableAutoNavigationOnLogout(url: string, router: Router) {
    this.logouts$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => router.navigateByUrl(url));
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user = new User({
      id: userData.localId,
      email: userData.email,
      rawToken: userData.idToken,
      tokenExpirationDate: expirationTime
    });
    this.user.next(user);
    this.storeAuthData(user);
  }

  private storeAuthData(user: User) {
    Plugins.Storage.set({ key: 'authData', value: user.stringify() });
  }
}
