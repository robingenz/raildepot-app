import { Pipe, PipeTransform } from '@angular/core';
import { File } from '@app/core';

@Pipe({
  name: 'undeletedFiles',
  standalone: true,
})
export class UndeletedFilesPipe implements PipeTransform {
  constructor() {}

  public transform(files: File[]): File[] {
    return files.filter(file => !file.isDeleted);
  }
}
