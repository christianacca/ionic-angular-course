import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Place, PlaceEntityService } from '../../places-state';

interface ComponentState {
  entity: Place | null;
}

@Component({
  templateUrl: './offers-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersEditPage extends RxState<ComponentState> {

  entity$: Observable<Place>;
  form = this.createForm();

  constructor(route: ActivatedRoute, private entityService: PlaceEntityService, private router: Router) {
    super();

    const entity$ = route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => entityService.entityById$(id)),
      map(entity => entity === undefined ? null : entity)
    );
    this.connect('entity', entity$);

    this.entity$ = this.select('entity');

    this.hold(this.select('entity'), entity => {
      this.form.patchValue(entity);
    });
  }

  private createForm(): FormGroup {
    return new FormGroup({
      title: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      })
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.entityService.save({ ...this.get('entity'), ...this.form.value });
    this.router.navigateByUrl('/places/tabs/offers');
  }
}
