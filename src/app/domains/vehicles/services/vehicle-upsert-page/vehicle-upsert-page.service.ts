import { Injectable } from '@angular/core';
import { File } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class VehicleUpsertPageService {
  constructor() {}

  public pickImage(): Promise<File> {
    throw new Error('Method not implemented.');
  }

  public pickInvoice(): Promise<File> {
    throw new Error('Method not implemented.');
  }

  // public uploadFile(options: UploadOptions): Promise<UploadResult> {
  //   throw new Error('Method not implemented.');
  // }
}
