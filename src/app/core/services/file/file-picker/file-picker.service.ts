import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PickedFile, PickFilesResult } from '@capawesome/capacitor-file-picker';
import {
  CapacitorFileCompressorService,
  CapacitorFilesystemService,
} from '../../capacitor';
import { CapacitorFilePickerService } from '../../capacitor/capacitor-file-picker/capacitor-file-picker.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ErrorParserService } from '../../error';

@Injectable({
  providedIn: 'root',
})
export class FilePickerService {
  constructor(
    private readonly capacitorFilePickerService: CapacitorFilePickerService,
    private readonly configurationService: ConfigurationService,
    private readonly errorParserService: ErrorParserService,
    private readonly capacitorFilesystemService: CapacitorFilesystemService,
    private readonly capacitorFileCompressorService: CapacitorFileCompressorService,
  ) {}

  public async pickFile(options?: {
    types?: string[];
  }): Promise<PickedFile | undefined> {
    try {
      const result = await this.capacitorFilePickerService.pickFiles({
        multiple: false,
        readData: false,
        types: options?.types,
      });
      return await this.handlePickFilesResult(result);
    } catch (error) {
      this.handleError(error);
      return undefined;
    }
  }

  public async pickImage(): Promise<PickedFile | undefined> {
    try {
      let result = await this.capacitorFilePickerService.pickImages({
        multiple: false,
        readData: false,
        skipTranscoding: true,
      });
      return await this.handlePickFilesResult(result);
    } catch (error) {
      this.handleError(error);
      return undefined;
    }
  }

  public async pickVideo(): Promise<PickedFile | undefined> {
    try {
      const result = await this.capacitorFilePickerService.pickVideos({
        multiple: false,
        readData: false,
        skipTranscoding: true,
      });
      return await this.handlePickFilesResult(result);
    } catch (error) {
      this.handleError(error);
      return undefined;
    }
  }

  private async handlePickFilesResult(
    result: PickFilesResult,
  ): Promise<PickedFile | undefined> {
    let pickedFile = result?.files ? result.files[0] : undefined;
    if (!pickedFile) {
      return undefined;
    }
    const maxFileSize = await this.configurationService.getMaxFileSize();
    if (pickedFile.size > maxFileSize) {
      throw new Error('File too large'); // TODO: translate
    }
    if (
      Capacitor.getPlatform() === 'ios' &&
      (pickedFile.mimeType === 'image/heic' ||
        pickedFile.mimeType === 'image/heif')
    ) {
      pickedFile = await this.convertHeicToJpeg(pickedFile);
    }
    const threshold =
      await this.configurationService.getImageCompressionThreshold();
    if (
      pickedFile.mimeType.startsWith('image/') &&
      pickedFile.size > threshold
    ) {
      pickedFile = await this.compressImage(pickedFile);
    }
    return pickedFile;
  }

  private async convertHeicToJpeg(file: PickedFile): Promise<PickedFile> {
    file = { ...file };
    file.mimeType = 'image/jpeg';
    file.name = file.name.replace('.heic', '.jpg');
    const { path } = await this.capacitorFilePickerService.convertHeicToJpeg({
      path: file.path || '',
    });
    file.path = path;
    const { size } = await this.capacitorFilesystemService.stat({ path });
    file.size = size;
    return file;
  }

  private async compressImage(file: PickedFile): Promise<PickedFile> {
    file = { ...file };
    const quality =
      await this.configurationService.getImageCompressionQuality();
    let { blob, path } =
      await this.capacitorFileCompressorService.compressImage({
        blob: file.blob,
        path: file.path,
        quality,
      });
    if (blob && blob.size > file.size) {
      return file;
    }
    if (path) {
      const statResult = await this.capacitorFilesystemService.stat({
        path: path,
      });
      if (statResult.size > file.size) {
        return file;
      }
      const newPath = path.split('/').slice(0, -1).join('/') + '/' + file.name;
      await this.capacitorFilesystemService.rename({
        from: path,
        to: newPath,
      });
      path = newPath;
    }
    file.blob = blob;
    file.path = path;
    return file;
  }

  private handleError(error: unknown): void {
    const message = this.errorParserService.getMessageFromUnknownError(error);
    if (message.includes('canceled')) {
      return;
    }
    throw error;
  }
}
