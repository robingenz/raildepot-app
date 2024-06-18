import { FormControl } from '@angular/forms';

export interface VehicleFormGroup {
  name: FormControl<string | null>;
}
