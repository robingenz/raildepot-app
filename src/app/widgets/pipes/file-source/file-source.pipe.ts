import { Pipe, PipeTransform } from '@angular/core';
import { ApiFilesService } from '@app/core/services/api';
import { Capacitor } from '@capacitor/core';

@Pipe({
  name: 'fileSource',
  standalone: true,
})
export class FileSourcePipe implements PipeTransform {
  constructor(private readonly apiFilesService: ApiFilesService) {}

  public async transform(fileId: string): Promise<string | undefined> {
    const { file } = await this.apiFilesService.download({
      id: fileId,
    });
    if (file.uri) {
      return Capacitor.convertFileSrc(file.uri);
    } else if (file.blob) {
      return window.URL.createObjectURL(file.blob);
    } else {
      return undefined;
    }
  }
}
