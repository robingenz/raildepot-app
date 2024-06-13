import { Injectable } from '@angular/core';
import { File, PlatformService } from '@app/core';

export interface DownloadOptions {
  id: string;
}

export interface DownloadResult {
  file: File;
}

export interface UploadOptions {
  file: File;
}

export interface UploadResult {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileTransferService {
  constructor(private readonly platformService: PlatformService) {}

  public download(options: DownloadOptions): Promise<DownloadResult> {
    const isNative = this.platformService.isNative();
    if (isNative) {
    } else {
    }
  }

  public upload(options: UploadOptions): Promise<UploadResult> {
    const isNative = this.platformService.isNative();
    if (isNative) {
    } else {
    }
  }
}
