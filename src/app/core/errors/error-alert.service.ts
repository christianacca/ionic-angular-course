import { Injectable } from '@angular/core';
import { isErrorDetail } from './error-detail';

@Injectable({ providedIn: 'root' })
export class ErrorAlertService {
  constructor() { }

  async showError(err: any) {
    let msg = `Problem: ${err.message}`;
    if (isErrorDetail(err)) {
      msg = `${msg}; Details: ${err.detail}`;
    }
    alert(msg);
    return Promise.resolve();
  }
}
