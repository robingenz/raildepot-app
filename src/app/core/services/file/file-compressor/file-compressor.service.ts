import { Injectable } from '@angular/core';
import {
  CompressImageOptions,
  CompressImageResult,
} from '@capawesome-team/capacitor-file-compressor';
import { CapacitorFileCompressorService } from '../../capacitor';

@Injectable({
  providedIn: 'root',
})
export class FileCompressorService {
  constructor(
    private readonly capacitorFileCompressorService: CapacitorFileCompressorService,
  ) {}

  public compressImage(
    options: CompressImageOptions,
  ): Promise<CompressImageResult> {
    return this.capacitorFileCompressorService.compressImage(options);
  }
}
