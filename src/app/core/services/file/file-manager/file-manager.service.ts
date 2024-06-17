import { Injectable } from '@angular/core';
import { Directory, ReaddirResult } from '@capacitor/filesystem';
import { CapacitorFilesystemService } from '../../capacitor';
import { ErrorParserService } from '../../error';
import { PlatformService } from '../../platform/platform.service';

export type ReadDirectoryResult = ReaddirResult;

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  constructor(
    private readonly capacitorFilesystemService: CapacitorFilesystemService,
    private readonly errorParserService: ErrorParserService,
    private readonly platformService: PlatformService,
  ) {}

  public async createCacheDirectory(path: string): Promise<void> {
    try {
      await this.capacitorFilesystemService.mkdir({
        path: path,
        directory: Directory.Cache,
        recursive: true,
      });
    } catch (error) {
      const message = this.errorParserService.getMessageFromUnknownError(error);
      if (
        message.includes('Directory exists') ||
        message.includes('directory does already exist')
      ) {
        return;
      }
      throw error;
    }
  }

  public async deleteFile(path: string): Promise<void> {
    await this.capacitorFilesystemService.deleteFile({
      path,
      directory: Directory.Cache,
    });
  }

  public async fileExists(path: string): Promise<boolean> {
    try {
      await this.capacitorFilesystemService.stat({
        path,
        directory: Directory.Cache,
      });
      return true;
    } catch (error) {
      const message = this.errorParserService.getMessageFromUnknownError(error);
      if (
        message.includes('Entry does not exist.') ||
        message.includes('File does not exist')
      ) {
        return false;
      }
      throw error;
    }
  }

  public async getUri(path: string): Promise<string> {
    const { uri } = await this.capacitorFilesystemService.getUri({
      path,
      directory: Directory.Cache,
    });
    return uri;
  }

  public readDirectory(path: string): Promise<ReadDirectoryResult> {
    return this.capacitorFilesystemService.readdir({
      path,
      directory: Directory.Cache,
    });
  }

  public async readFileAsBlob(path: string): Promise<Blob | undefined> {
    const { data } = await this.capacitorFilesystemService.readFile({
      path,
      directory: Directory.Cache,
    });
    return data instanceof Blob ? data : undefined;
  }
}
