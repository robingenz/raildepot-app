import { Injectable } from '@angular/core';
import {
  CompressImageOptions,
  CompressImageResult,
  FileCompressor,
} from '@capawesome-team/capacitor-file-compressor';

@Injectable({
  providedIn: 'root',
})
export class CapacitorFileCompressorService {
  constructor() {}

  public compressImage(
    options: CompressImageOptions,
  ): Promise<CompressImageResult> {
    return FileCompressor.compressImage(options);
  }
}
