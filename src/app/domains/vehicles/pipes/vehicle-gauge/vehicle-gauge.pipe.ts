import { Pipe, PipeTransform } from '@angular/core';
import { VehicleGauge } from '../../enums';

@Pipe({
  name: 'vehicleGauge',
  standalone: true,
})
export class VehicleGaugePipe implements PipeTransform {
  constructor() {}

  public transform(value: VehicleGauge): string {
    switch (value) {
      case VehicleGauge.H0: {
        return 'H0';
      }
      case VehicleGauge.N: {
        return 'N';
      }
      case VehicleGauge.S: {
        return 'S';
      }
      case VehicleGauge.Tt: {
        return 'TT';
      }
      case VehicleGauge.Z: {
        return 'Z';
      }
      case VehicleGauge.I: {
        return '1';
      }
      case VehicleGauge.Ii: {
        return '2';
      }
      case VehicleGauge.O: {
        return '0';
      }
      case VehicleGauge.OO: {
        return '00';
      }
    }
  }
}
