import { Pipe, PipeTransform } from '@angular/core';
import { VehicleFile } from '../../interfaces';

@Pipe({
  name: 'undeletedFiles',
  standalone: true,
})
export class UndeletedFilesPipe implements PipeTransform {
  constructor() {}

  public transform(files: VehicleFile[]): VehicleFile[] {
    return files.filter(file => !file.isDeleted);
  }
}
