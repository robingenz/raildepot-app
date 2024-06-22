import { ChangeDetectorRef, Component, effect, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DeactivationGuard, File } from '@app/core';
import { SharedModule } from '@app/shared';
import { FileSourcePipe, UndeletedFilesPipe } from '@app/widgets';
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
import {
  VehicleCategory,
  VehicleCondition,
  VehicleEpoch,
  VehicleGauge,
} from '../../enums';
import { Vehicle } from '../../interfaces';
import {
  VehicleCategoryPipe,
  VehicleConditionPipe,
  VehicleEpochPipe,
  VehicleGaugePipe,
} from '../../pipes';
import { CreateVehicleOptions, VehicleUpsertPageService } from '../../services';

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
    UndeletedFilesPipe,
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
  public readonly imagesFormControl = new FormControl<File[]>([]);
  public readonly modelAxlesTotalFormControl = new FormControl<number | null>(
    null,
  );
  public readonly modelAxlesPoweredFormControl = new FormControl<number | null>(
    null,
  );
  public readonly modelAxlesTractionedFormControl = new FormControl<
    number | null
  >(null);
  public readonly purchaseDateFormControl = new FormControl<string | null>(
    null,
  );
  public readonly purchaseInvoicesFormControl = new FormControl<File[]>([]);
  public readonly form = new FormGroup({
    createdAt: new FormControl<string | null>(null),
    createdBy: new FormControl<string | null>(null),
    updatedAt: new FormControl<string | null>(null),
    updatedBy: new FormControl<string | null>(null),
    images: this.imagesFormControl,
    inventoryNumber: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null),
    additionalName: new FormControl<string | null>(null),
    quantity: new FormControl<number | null>(null),
    category: new FormControl<VehicleCategory | null>(null),
    type: new FormControl<string | null>(null),
    company: new FormControl<string | null>(null),
    classNumber: new FormControl<number | null>(null),
    serialNumber: new FormControl<number | null>(null),
    uic: new FormControl<string | null>(null),
    note: new FormControl<string | null>(null),
    model: new FormGroup({
      epoch: new FormControl<VehicleEpoch | null>(null),
      manufacturer: new FormControl<string | null>(null),
      articleNumber: new FormControl<string | null>(null),
      serialNumber: new FormControl<string | null>(null),
      gauge: new FormControl<VehicleGauge | null>(null),
      weight: new FormControl<number | null>(null),
      length: new FormControl<number | null>(null),
      axles: new FormGroup({
        total: this.modelAxlesTotalFormControl,
        powered: this.modelAxlesPoweredFormControl,
        tractioned: this.modelAxlesTractionedFormControl,
      }),
      hasSound: new FormControl<boolean | null>(null),
      hasLight: new FormControl<boolean | null>(null),
      hasSmoke: new FormControl<boolean | null>(null),
      hasOriginalBox: new FormControl<boolean | null>(null),
      isLimited: new FormControl<boolean | null>(null),
    }),
    digital: new FormGroup({
      decoderName: new FormControl<string | null>(null),
      // interface: new FormControl<string | null>(null),
      // protocol: new FormControl<string | null>(null),
      decoderAddress: new FormControl<number | null>(null),
    }),
    purchase: new FormGroup({
      date: this.purchaseDateFormControl,
      location: new FormControl<string | null>(null),
      price: new FormControl<number | null>(null),
      msrp: new FormControl<number | null>(null),
      invoiceNumber: new FormControl<string | null>(null),
      invoices: this.purchaseInvoicesFormControl,
    }),
    storage: new FormGroup({
      storageLocation: new FormControl<string | null>(null),
      installationLocation: new FormControl<string | null>(null),
      condition: new FormControl<VehicleCondition | null>(null),
    }),
  });
  public readonly vehicleId: string | undefined =
    this.activatedRoute.snapshot.params['id'];
  public readonly vehicle = this.vehicleId
    ? this.vehicleUpsertPageService.getVehicleById(this.vehicleId).result
    : signal(undefined);

  public readonly categories = VehicleCategory;
  public readonly conditions = VehicleCondition;
  public readonly gauges = VehicleGauge;
  public readonly epochs = VehicleEpoch;

  public isPurchaseDateModalOpen = false;

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

  public onClosePurchaseDateModal(): void {
    this.isPurchaseDateModalOpen = false;
  }

  public onDeletePurchaseDate(): void {
    this.purchaseDateFormControl.setValue(null);
    this.purchaseDateFormControl.markAsDirty();
  }

  public onOpenPurchaseDateModal(): void {
    this.isPurchaseDateModalOpen = true;
  }

  public async onPickImage(): Promise<void> {
    const pickedImage = await this.vehicleUpsertPageService.pickImage();
    if (!pickedImage) {
      return;
    }
    this.imagesFormControl.setValue([
      ...(this.imagesFormControl.value || []),
      pickedImage,
    ]);
    this.imagesFormControl.markAsDirty();
  }

  public async onPickInvoice(): Promise<void> {
    const pickedInvoice = await this.vehicleUpsertPageService.pickInvoice();
    if (!pickedInvoice) {
      return;
    }
    this.purchaseInvoicesFormControl.setValue([
      ...(this.purchaseInvoicesFormControl.value || []),
      pickedInvoice,
    ]);
    this.purchaseInvoicesFormControl.markAsDirty();
  }

  public async onPresentDeleteVehicleAlert(): Promise<void> {
    const confirmed =
      await this.vehicleUpsertPageService.presentDeleteVehicleAlert();
    if (!confirmed) {
      return;
    }
    await this.deleteVehicle?.mutateAsync();
    this.form.markAsPristine();
    await this.vehicleUpsertPageService.navigateToVehicleListPage();
  }

  public async onPresentEditImageActionSheet(file: File): Promise<void> {
    await this.vehicleUpsertPageService.presentEditImageActionSheet(
      file,
      () => {
        file.isDeleted = true;
        this.imagesFormControl.setValue([
          ...(this.imagesFormControl.value || []),
        ]);
        this.imagesFormControl.markAsDirty();
      },
    );
  }

  public async onPresentEditInvoiceActionSheet(file: File): Promise<void> {
    await this.vehicleUpsertPageService.presentEditInvoiceActionSheet(
      file,
      () => {
        file.isDeleted = true;
        this.purchaseInvoicesFormControl.setValue([
          ...(this.purchaseInvoicesFormControl.value || []),
        ]);
        this.purchaseInvoicesFormControl.markAsDirty();
      },
    );
  }

  public async onPresentVehicleModelAxlesAlert(): Promise<void> {
    const currentAxles = {
      total: this.modelAxlesTotalFormControl.value,
      powered: this.modelAxlesPoweredFormControl.value,
      tractioned: this.modelAxlesTractionedFormControl.value,
    };
    const nextAxles =
      await this.vehicleUpsertPageService.presentVehicleModelAxlesAlert(
        currentAxles,
      );
    if (currentAxles.total !== nextAxles.total) {
      this.modelAxlesTotalFormControl.setValue(nextAxles.total ?? null);
      this.modelAxlesTotalFormControl.markAsDirty();
    }
    if (currentAxles.powered !== nextAxles.powered) {
      this.modelAxlesPoweredFormControl.setValue(nextAxles.powered ?? null);
      this.modelAxlesPoweredFormControl.markAsDirty();
    }
    if (currentAxles.tractioned !== nextAxles.tractioned) {
      this.modelAxlesTractionedFormControl.setValue(
        nextAxles.tractioned ?? null,
      );
      this.modelAxlesTractionedFormControl.markAsDirty();
    }
  }

  public async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      return;
    }
    await this.saveVehicle();
    await this.vehicleUpsertPageService.navigateToVehicleListPage();
  }

  public originalOrder(a: unknown, b: unknown): number {
    return 0;
  }

  private patchFormValue(vehicle: Vehicle | undefined): void {
    this.form.patchValue({
      name: vehicle?.name,
    });
    this.changeDetectorRef.markForCheck();
  }

  private async saveVehicle(): Promise<void> {
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
    if (this.vehicleId) {
      return this.updateVehicle?.mutateAsync(options);
    } else {
      return this.addVehicle.mutateAsync(options);
    }
  }

  private throwErrorAndNavigateToVehicleListPage(): void {
    this.vehicleUpsertPageService.throwErrorAndNavigateToVehicleListPage();
  }
}
