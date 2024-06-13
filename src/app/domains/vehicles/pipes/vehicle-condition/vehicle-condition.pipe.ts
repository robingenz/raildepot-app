import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { VehicleCondition } from '../../enums';

@Pipe({
  name: 'vehicleCondition',
  standalone: true,
})
export class VehicleConditionPipe implements PipeTransform {
  constructor(private readonly translocoService: TranslocoService) {}

  public transform(value: VehicleCondition): Observable<string> {
    switch (value) {
      case VehicleCondition.New: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleCondition.label.new',
        );
      }
      case VehicleCondition.UsedVeryGood: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleCondition.label.usedVeryGood',
        );
      }
      case VehicleCondition.UsedGood: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleCondition.label.usedGood',
        );
      }
      case VehicleCondition.UsedAcceptable: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleCondition.label.usedAcceptable',
        );
      }
    }
  }
}
