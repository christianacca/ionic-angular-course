import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceEntityService, PlaceLocation } from '../../places-state';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  templateUrl: './offers-new.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersNewPage {

  constructor(
    private entityService: PlaceEntityService,
    private router: Router,
    private loadingCtrl: LoadingController) { }

  form = this.createForm();

  async onCreateOffer() {
    if (!this.form.valid) {
      return;
    }
    const { image, ...entity } = this.form.value;
    const loading = await this.loadingCtrl.create({ message: 'Creating place...' });
    await loading.present();
    const { imageUrl } = await this.entityService
      .uploadImage(image).toPromise()
      .finally(() => loading.dismiss());
    this.entityService.save({ ...entity, imageUrl });
    this.router.navigateByUrl('/places/tabs/offers');
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location });
  }

  private createForm() {
    return new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required, Validators.maxLength(180)] }),
      price: new FormControl(null, { validators: [Validators.required, Validators.min(1)] }),
      availableFrom: new FormControl(null, { validators: [Validators.required] }),
      availableTo: new FormControl(null, { validators: [Validators.required] }),
      location: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] })
    });
  }
}
