import { ChangeDetectorRef, Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DeactivationGuard } from '@app/core';
import { SharedModule } from '@app/shared';
import { FileSourcePipe } from '@app/widgets';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Vehicle } from '../../interfaces';
import {
  VehicleCategoryPipe,
  VehicleConditionPipe,
  VehicleEpochPipe,
  VehicleGaugePipe,
} from '../../pipes';
import { CreateVehicleOptions, VehicleUpsertPageService } from '../../services';

export const vehicleUpsertPageSelector = 'app-vehicle-upsert';

@Component({
  selector: 'app-vehicle-upsert-page',
  templateUrl: './vehicle-upsert-page.component.html',
  styleUrls: ['./vehicle-upsert-page.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    TranslocoPipe,
    VehicleCategoryPipe,
    VehicleGaugePipe,
    FileSourcePipe,
    VehicleEpochPipe,
    VehicleConditionPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonIcon,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonBackButton,
    IonSelect,
    IonSelectOption,
    IonDatetimeButton,
    IonModal,
    IonNote,
    IonAccordion,
    IonAccordionGroup,
    IonImg,
    IonToggle,
  ],
})
export class VehicleUpsertPageComponent implements DeactivationGuard {
  public readonly vehicleId: string | undefined =
    this.activatedRoute.snapshot.params['id'];
  public readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });
  public readonly vehicle = this.vehicleId
    ? this.vehicleUpsertPageService.getVehicleById(this.vehicleId).result
    : signal(undefined);

  private readonly addVehicle = this.vehicleUpsertPageService.createVehicle();
  private readonly updateVehicle = this.vehicleId
    ? this.vehicleUpsertPageService.updateVehicleById(this.vehicleId)
    : undefined;
  private readonly deleteVehicle = this.vehicleId
    ? this.vehicleUpsertPageService.deleteVehicleById(this.vehicleId)
    : undefined;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly vehicleUpsertPageService: VehicleUpsertPageService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    addIcons({ add });
    effect(() => {
      const vehicle = this.vehicle()?.data;
      if (vehicle === null) {
        void this.throwErrorAndNavigateToVehicleListPage();
      } else {
        this.patchFormValue(vehicle);
      }
    });
  }

  public async canDeactivate(): Promise<boolean> {
    if (!this.form.dirty) {
      return true;
    }
    return this.vehicleUpsertPageService.presentUnsavedChangesAlert();
  }

  public async onDeleteVehicle(): Promise<void> {
    // const vehicle = this.vehicle()?.data;
    // if (!vehicle) {
    //   return;
    // }
    // await this.deleteVehicle?.mutateAsync();
    // this.form.markAsPristine();
    // await this.vehicleUpsertPageService.navigateToVehicleListPage();
  }

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      return;
    }
    await this.saveVehicle();
    await this.vehicleUpsertPageService.navigateToVehicleListPage();
  }

  private patchFormValue(vehicle: Vehicle | undefined): void {
    this.form.patchValue({
      name: vehicle?.name,
    });
    this.changeDetectorRef.markForCheck();
  }

  private async saveVehicle(): Promise<void> {
    const vehicle = this.vehicle()?.data;
    const options: CreateVehicleOptions = {
      additionalName: null,
      category: null,
      classNumber: null,
      company: null,
      digital: {
        decoderAddress: null,
        decoderName: null,
      },
      name: this.form.value.name || '',
      imageFileIds: null,
      inventoryNumber: null,
      model: {
        articleNumber: null,
        axles: {
          total: null,
          powered: null,
          tractioned: null,
        },
        epoch: null,
        gauge: null,
        hasLight: null,
        hasOriginalBox: null,
        hasSmoke: null,
        hasSound: null,
        isLimited: null,
        length: null,
        manufacturer: null,
        serialNumber: null,
        weight: null,
      },
      note: null,
      purchase: {
        date: null,
        invoiceNumber: null,
        invoiceFileId: null,
        location: null,
        msrp: null,
        price: null,
      },
      quantity: null,
      serialNumber: null,
      storage: {
        storageLocation: null,
        installationLocation: null,
        condition: null,
      },
      type: null,
      uic: null,
    };
    if (vehicle) {
      return this.updateVehicle?.mutateAsync(options);
    } else {
      return this.addVehicle.mutateAsync(options);
    }
  }

  private throwErrorAndNavigateToVehicleListPage(): void {
    this.vehicleUpsertPageService.throwErrorAndNavigateToVehicleListPage();
  }
}
