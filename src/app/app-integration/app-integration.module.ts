import { NgModule } from '@angular/core';
import { ErrorAlertService } from '../core';
import { entityDefaultsFactoryProvider } from './entity-defaults-factory.provider';
import { IonicErrorAlertService } from './ionic-error-alert.service';

@NgModule({
  providers: [
    { provide: ErrorAlertService, useClass: IonicErrorAlertService },
    entityDefaultsFactoryProvider
  ],
})
export class AppIntegrationModule { }
