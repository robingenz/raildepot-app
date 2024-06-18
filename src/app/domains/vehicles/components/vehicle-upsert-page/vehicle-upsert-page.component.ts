import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  ViewDidEnter,
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
import { VehicleUpsertPageService } from '../../services';

export const vehicleUpsertPageSelector = 'app-vehicle-upsert';

@UntilDestroy()
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
export class VehicleUpsertPageComponent
  implements ViewDidEnter, DeactivationGuard
{
  public readonly documentId: string | undefined;
  public readonly imagesFormControl = new FormControl<VehicleFile[]>([]);
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
  public readonly purchaseInvoicesFormControl = new FormControl<VehicleFile[]>(
    [],
  );
  public readonly digitalActionsFormControl = new FormControl<
    VehicleDigitalAction[] | null
  >(null);
  public readonly form = new FormGroup<VehicleFormGroup>({
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
      actions: this.digitalActionsFormControl,
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

  public readonly categories = VehicleCategory;
  public readonly conditions = VehicleCondition;
  public readonly gauges = VehicleGauge;
  public readonly epochs = VehicleEpoch;

  public isPurchaseDateModalOpen = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly vehicleUpsertPageService: VehicleUpsertPageService,
  ) {
    addIcons({ add });
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id && id !== 'create') {
      this.documentId = id;
    }
  }

  public ionViewDidEnter(): void {
    if (!this.documentId) {
      return;
    }
    void this.vehicleUpsertPageService
      .getVehicleById(this.documentId)
      .then(document => {
        this.setVehicleAsFormValue(document);
      });
  }

  public async canDeactivate(): Promise<boolean> {
    if (!this.form.dirty) {
      return true;
    }
    return this.vehicleUpsertPageService.presentUnsavedChangesAlert();
  }

  public async saveChanges(): Promise<void> {
    if (!this.form.valid || !this.form.dirty) {
      return;
    }
    const document = await this.getVehicleFromFormValue();
    await this.vehicleUpsertPageService.setVehicle(this.documentId, document);
    this.form.markAsPristine();
    await this.vehicleUpsertPageService.navigateToVehicleListPage();
  }

  public async presentDeleteVehicleAlert(): Promise<void> {
    if (!this.documentId) {
      return;
    }
    await this.vehicleUpsertPageService.presentDeleteVehicleAlert(
      this.documentId,
    );
  }

  public async pickImage(): Promise<void> {
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

  public async presentEditImageActionSheet(image: VehicleFile): Promise<void> {
    await this.vehicleUpsertPageService.presentEditImageActionSheet(
      this.documentId,
      image,
      () => {
        image.isDeleted = true;
        this.imagesFormControl.setValue([
          ...(this.imagesFormControl.value || []),
        ]);
        this.imagesFormControl.markAsDirty();
      },
    );
  }

  public async presentVehicleModelAxlesAlert(): Promise<void> {
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

  public async presentVehicleDigitalActionListModal(): Promise<void> {
    const currentActions = this.digitalActionsFormControl.value || [];
    const nextActions =
      await this.vehicleUpsertPageService.presentVehicleDigitalActionListModal(
        currentActions,
      );
    if (JSON.stringify(nextActions) !== JSON.stringify(currentActions)) {
      this.digitalActionsFormControl.setValue(nextActions);
      this.digitalActionsFormControl.markAsDirty();
    }
  }

  public async pickInvoice(): Promise<void> {
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

  public async presentEditInvoiceActionSheet(
    invoice: VehicleFile,
  ): Promise<void> {
    await this.vehicleUpsertPageService.presentEditInvoiceActionSheet(
      this.documentId,
      invoice,
      () => {
        invoice.isDeleted = true;
        this.purchaseInvoicesFormControl.setValue([
          ...(this.purchaseInvoicesFormControl.value || []),
        ]);
        this.purchaseInvoicesFormControl.markAsDirty();
      },
    );
  }

  public openPurchaseDateModal(): void {
    this.isPurchaseDateModalOpen = true;
  }

  public closePurchaseDateModal(): void {
    this.isPurchaseDateModalOpen = false;
  }

  public deletePurchaseDate(): void {
    this.purchaseDateFormControl.setValue(null);
    this.purchaseDateFormControl.markAsDirty();
  }

  public originalOrder(a: unknown, b: unknown): number {
    return 0;
  }

  private setVehicleAsFormValue(document: Vehicle): void {
    this.form.setValue({
      category: document.category,
      type: document.type,
      classNumber: document.classNumber,
      serialNumber: document.serialNumber,
      company: document.company,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      digital: document.digital,
      images: document.images,
      inventoryNumber: document.inventoryNumber,
      model: document.model,
      name: document.name,
      additionalName: document.additionalName,
      purchase: document.purchase,
      storage: document.storage,
      uic: document.uic,
      quantity: document.quantity,
      note: document.note,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }

  private async getVehicleFromFormValue(): Promise<Omit<Vehicle, 'id'>> {
    const userId = await this.vehicleUpsertPageService.getCurrentUserId();
    const data: Omit<Vehicle, 'id'> = {
      createdAt: this.form.value.createdAt || new Date().toISOString(),
      createdBy: this.form.value.createdBy || userId || null,
      updatedAt: this.form.value.updatedAt || new Date().toISOString(),
      updatedBy: userId || null,
      deletedAt: null,
      inventoryNumber: this.form.value.inventoryNumber || null,
      name: this.form.value.name || null,
      additionalName: this.form.value.additionalName || null,
      category: this.form.value.category || null,
      type: this.form.value.type || null,
      company: this.form.value.company || null,
      classNumber: this.form.value.classNumber || null,
      serialNumber: this.form.value.serialNumber || null,
      uic: this.form.value.uic || null,
      model: {
        epoch: this.form.value.model?.epoch || null,
        manufacturer: this.form.value.model?.manufacturer || null,
        articleNumber: this.form.value.model?.articleNumber || null,
        serialNumber: this.form.value.model?.serialNumber || null,
        gauge: this.form.value.model?.gauge || null,
        weight: this.form.value.model?.weight || null,
        length: this.form.value.model?.length || null,
        axles: {
          total: this.form.value.model?.axles?.total || null,
          powered: this.form.value.model?.axles?.powered || null,
          tractioned: this.form.value.model?.axles?.tractioned || null,
        },
        hasSound: this.form.value.model?.hasSound || null,
        hasLight: this.form.value.model?.hasLight || null,
        hasSmoke: this.form.value.model?.hasSmoke || null,
        hasOriginalBox: this.form.value.model?.hasOriginalBox || null,
        isLimited: this.form.value.model?.isLimited || null,
      },
      digital: {
        decoderName: this.form.value.digital?.decoderName || null,
        // interface: this.form.value.digital?.interface || null,
        // protocol: this.form.value.digital?.protocol || null,
        decoderAddress: this.form.value.digital?.decoderAddress || null,
      },
      purchase: {
        date: this.form.value.purchase?.date || null,
        location: this.form.value.purchase?.location || null,
        price: this.form.value.purchase?.price || null,
        msrp: this.form.value.purchase?.msrp || null,
        invoiceNumber: this.form.value.purchase?.invoiceNumber || null,
        invoices: this.form.value.purchase?.invoices || [],
      },
      storage: {
        storageLocation: this.form.value.storage?.storageLocation || null,
        installationLocation:
          this.form.value.storage?.installationLocation || null,
        condition: this.form.value.storage?.condition || null,
      },
      images: this.form.value.images || [],
      quantity: this.form.value.quantity || null,
      note: this.form.value.note || null,
    };
    return data;
  }
}
