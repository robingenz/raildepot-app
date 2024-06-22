import { Injectable } from '@angular/core';
import {
  CapacitorFilesystemService,
  File,
  FileManagerService,
  PlatformService,
} from '@app/core';
import { Directory } from '@capacitor/filesystem';

export interface DownloadOptions {
  url: string;
  path: string;
}

export interface DownloadResult {
  file: File;
}

@Injectable({
  providedIn: 'root',
})
export class FileTransferService {
  constructor(
    private readonly platformService: PlatformService,
    private readonly fileManagerService: FileManagerService,
    private readonly capacitorFilesystemService: CapacitorFilesystemService,
  ) {}

  public async download(options: DownloadOptions): Promise<DownloadResult> {
    const isCached = await this.isFileCached(options.path);
    if (isCached) {
      const file = await this.getFileFromCache(options.path);
      return {
        file,
      };
    } else {
      const result = await this.capacitorFilesystemService.downloadFile({
        url: options.url,
        path: options.path,
        directory: Directory.Cache,
      });
      return {
        file: {
          blob: result.blob,
          path: result.path,
        },
      };
    }
  }

  private async getFileFromCache(path: string): Promise<File> {
    const isNative = this.platformService.isNative();
    if (isNative) {
      const uri = await this.fileManagerService.getUri(path);
      return {
        path: uri,
      };
    } else {
      const blob = await this.fileManagerService.readFileAsBlob(path);
      return {
        blob,
      };
    }
  }

  private async isFileCached(path: string): Promise<boolean> {
    return this.fileManagerService.fileExists(path);
  }
}
