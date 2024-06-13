import { Pipe, PipeTransform } from '@angular/core';
import { FileTransferService } from '@app/core';
import { Capacitor } from '@capacitor/core';

@Pipe({
  name: 'fileSource',
  standalone: true,
})
export class FileSourcePipe implements PipeTransform {
  constructor(private readonly fileTransferService: FileTransferService) {}

  public async transform(fileId: string): Promise<string | undefined> {
    const { file } = await this.fileTransferService.download({
      id: fileId,
    });
    if (file.type === 'native') {
      return Capacitor.convertFileSrc(file.path);
    } else {
      return window.URL.createObjectURL(file.blob);
    }
  }
}
