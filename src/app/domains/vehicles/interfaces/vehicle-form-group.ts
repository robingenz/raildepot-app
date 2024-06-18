import { FormControl, FormGroup } from '@angular/forms';
import {
  VehicleCategory,
  VehicleCondition,
  VehicleEpoch,
  VehicleGauge,
} from '../enums';

export interface VehicleFormGroup {
  createdAt: FormControl<string | null>;
  createdBy: FormControl<string | null>;
  updatedAt: FormControl<string | null>;
  updatedBy: FormControl<string | null>;
  inventoryNumber: FormControl<string | null>;
  name: FormControl<string | null>;
  additionalName: FormControl<string | null>;
  imageFileIds: FormControl<string[] | null>;
  quantity: FormControl<number | null>;
  category: FormControl<VehicleCategory | null>;
  type: FormControl<string | null>;
  company: FormControl<string | null>;
  classNumber: FormControl<number | null>;
  serialNumber: FormControl<number | null>;
  uic: FormControl<string | null>;
  note: FormControl<string | null>;
  model: FormGroup<{
    epoch: FormControl<VehicleEpoch | null>;
    manufacturer: FormControl<string | null>;
    articleNumber: FormControl<string | null>;
    serialNumber: FormControl<string | null>;
    gauge: FormControl<VehicleGauge | null>;
    weight: FormControl<number | null>;
    length: FormControl<number | null>;
    axles: FormGroup<{
      total: FormControl<number | null>;
      powered: FormControl<number | null>;
      tractioned: FormControl<number | null>;
    }>;
    hasSound: FormControl<boolean | null>;
    hasLight: FormControl<boolean | null>;
    hasSmoke: FormControl<boolean | null>;
    hasOriginalBox: FormControl<boolean | null>;
    isLimited: FormControl<boolean | null>;
  }>;
  digital: FormGroup<{
    decoderName: FormControl<string | null>;
    // interface: FormControl<string | null>;
    // protocol: FormControl<string | null>;
    decoderAddress: FormControl<number | null>;
  }>;
  purchase: FormGroup<{
    date: FormControl<string | null>;
    location: FormControl<string | null>;
    price: FormControl<number | null>;
    msrp: FormControl<number | null>;
    invoiceNumber: FormControl<string | null>;
    invoiceFileId: FormControl<string | null>;
  }>;
  storage: FormGroup<{
    storageLocation: FormControl<string | null>;
    installationLocation: FormControl<string | null>;
    condition: FormControl<VehicleCondition | null>;
  }>;
}
