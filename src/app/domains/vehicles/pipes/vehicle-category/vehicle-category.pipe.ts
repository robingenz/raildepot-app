import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';

@Pipe({
  name: 'vehicleCategory',
  standalone: true,
})
export class VehicleCategoryPipe implements PipeTransform {
  constructor(private readonly translocoService: TranslocoService) {}

  public transform(value: VehicleCategory): Observable<string> {
    switch (value) {
      case VehicleCategory.Locomotive: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleCategory.label.locomotive',
        );
      }
      case VehicleCategory.Railcar: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleCategory.label.railcar',
        );
      }
      case VehicleCategory.Wagon: {
        return this.translocoService.selectTranslate(
          'vehicles.dialog.vehicleCategory.label.wagon',
        );
      }
    }
  }
}
