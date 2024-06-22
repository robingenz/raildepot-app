import { Pipe, PipeTransform } from '@angular/core';
import { File } from '@app/core';
import { ApiFilesService } from '@app/core/services/api';
import { Capacitor } from '@capacitor/core';

@Pipe({
  name: 'fileSource',
  standalone: true,
})
export class FileSourcePipe implements PipeTransform {
  constructor(private readonly apiFilesService: ApiFilesService) {}

  public async transform(file: File): Promise<string | undefined> {
    let blob = file.blob;
    let path = file.path;
    if (!blob && !path && file.id) {
      const { file: downloadedFile } = await this.apiFilesService.download({
        id: file.id,
      });
      blob = downloadedFile.blob;
      path = downloadedFile.path;
    }
    if (blob) {
      return window.URL.createObjectURL(blob);
    } else if (path) {
      return Capacitor.convertFileSrc(path);
    } else {
      return undefined;
    }
  }
}
