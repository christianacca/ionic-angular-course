import { FactoryProvider } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth';
import { EntityBase } from '../core';
import { ENTITY_DEFAULTS_FACTORY_TOKEN, generateUUId } from '../entity';

export function entityDefaultsFactory(authService: AuthService) {
  return <T extends EntityBase>(entity: T) => authService.userId$.pipe(
    map<string, T>(userId => {
      const defaults: EntityBase = {
        id: generateUUId(),
        userId
      };
      return {
        ...entity,
        id: entity.id || defaults.id,
        userId: entity.userId || defaults.userId
      };
    })
  );
}

export const entityDefaultsFactoryProvider: FactoryProvider = {
  provide: ENTITY_DEFAULTS_FACTORY_TOKEN,
  useFactory: entityDefaultsFactory,
  deps: [AuthService]
};
