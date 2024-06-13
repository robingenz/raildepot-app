import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { VehicleEpoch } from '../../enums';

@Pipe({
  name: 'vehicleEpoch',
  standalone: true,
})
export class VehicleEpochPipe implements PipeTransform {
  constructor(private readonly translocoService: TranslocoService) {}

  public transform(value: VehicleEpoch): Observable<string> {
    switch (value) {
      case VehicleEpoch.I: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleEpoch.label.i',
        );
      }
      case VehicleEpoch.Ii: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleEpoch.label.ii',
        );
      }
      case VehicleEpoch.Iii: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleEpoch.label.iii',
        );
      }
      case VehicleEpoch.Iv: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleEpoch.label.iv',
        );
      }
      case VehicleEpoch.V: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleEpoch.label.v',
        );
      }
      case VehicleEpoch.Vi: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleEpoch.label.vi',
        );
      }
    }
  }
}
