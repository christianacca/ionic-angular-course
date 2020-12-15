
export interface UserData {
  id: string;
  email: string;
  rawToken: string;
  tokenExpirationDate: Date;
}

type RawUserData = {
  readonly [P in keyof UserData]: string;
};

export class User implements UserData {

  constructor(data: UserData) {
    Object.assign(this, data);
  }

  get token() {
    if (this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this.rawToken;
  }

  get hasValidToken() {
    return this.token != null;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }

  static unauthenticated = new User({
    email: 'anonymous@unknown.com',
    id: '-1',
    rawToken: '',
    tokenExpirationDate: new Date()
  });

  readonly id: string;
  readonly email: string;
  readonly rawToken: string;
  readonly tokenExpirationDate: Date;

  static parse(value: string) {
    const rawUserData = JSON.parse(value) as RawUserData;
    const userData = { ...rawUserData, tokenExpirationDate: new Date(rawUserData.tokenExpirationDate) };
    return new User(userData);
  }

  stringify() {
    return JSON.stringify({
      id: this.id,
      email: this.email,
      rawToken: this.rawToken,
      tokenExpirationDate: this.tokenExpirationDate.toISOString()
    });
  }
}
