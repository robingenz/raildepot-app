import { Injectable } from '@angular/core';
import {
  DialogService,
  File,
  FileOpenerService,
  FilePickerService,
  RouterService,
} from '@app/core';
import { ApiFilesService } from '@app/core/services/api';
import { TranslocoService } from '@jsverse/transloco';
import {
  MutationResult,
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@ngneat/query';
import { Result } from '@ngneat/query/lib/types';
import { QueryObserverResult } from '@tanstack/query-core';
import { Vehicle, VehicleModelAxles } from '../../interfaces';
import {
  CreateVehicleOptions,
  UpdateVehicleOptions,
  VehicleService,
} from '../vehicle/vehicle.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleUpsertPageService {
  #client = injectQueryClient();
  #mutation = injectMutation();
  #query = injectQuery();

  constructor(
    private readonly vehicleService: VehicleService,
    private readonly dialogService: DialogService,
    private readonly translocoService: TranslocoService,
    private readonly routerService: RouterService,
    private readonly filePickerService: FilePickerService,
    private readonly fileOpenerService: FileOpenerService,
    private readonly apiFilesService: ApiFilesService,
  ) {}

  public createVehicle(): MutationResult<
    void,
    Error,
    CreateVehicleOptions,
    unknown
  > {
    return this.#mutation({
      mutationFn: (vehicle: CreateVehicleOptions) =>
        this.vehicleService.create(vehicle),
      onSuccess: () => {
        void this.#client.invalidateQueries({ queryKey: ['vehicles'] });
      },
    });
  }

  public deleteVehicleById(
    id: string,
  ): MutationResult<void, Error, void, unknown> {
    return this.#mutation({
      mutationFn: () => this.vehicleService.deleteById(id),
      onSuccess: () => {
        void this.#client.invalidateQueries({ queryKey: ['vehicles'] });
      },
    });
  }

  public getVehicleById(
    id: string,
  ): Result<QueryObserverResult<Vehicle | null, Error>> {
    return this.#query({
      queryKey: ['vehicles', id],
      queryFn: () => this.vehicleService.findOneById(id),
    });
  }

  public async navigateToVehicleListPage(): Promise<void> {
    await this.routerService.navigateToVehicleListPage({
      animationDirection: 'back',
    });
  }

  public async pickImage(): Promise<File | undefined> {
    const pickedFile = await this.filePickerService.pickImage();
    if (!pickedFile) {
      return;
    }
    const file: File = {
      name: pickedFile.name,
      path: pickedFile.path,
      blob: pickedFile.blob,
    };
    return file;
  }

  public async pickInvoice(): Promise<File | undefined> {
    const pickedInvoice = await this.filePickerService.pickFile({
      types: ['application/pdf'],
    });
    if (!pickedInvoice) {
      return;
    }
    const file: File = {
      name: pickedInvoice.name,
      path: pickedInvoice.path,
      blob: pickedInvoice.blob,
    };
    return file;
  }

  public async presentDeleteVehicleAlert(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      void this.dialogService.presentAlert({
        header: this.translocoService.translate(
          'domain.vehicles.dialog.deleteVehicle.header',
        ),
        message: this.translocoService.translate(
          'domain.vehicles.dialog.deleteVehicle.message',
        ),
        buttons: [
          {
            text: this.translocoService.translate(
              'domain.vehicles.dialog.deleteVehicle.button.cancel',
            ),
            role: 'cancel',
            handler: (): void => {
              resolve(false);
            },
          },
          {
            text: this.translocoService.translate(
              'domain.vehicles.dialog.deleteVehicle.button.delete',
            ),
            role: 'destructive',
            handler: (): void => {
              resolve(true);
            },
          },
        ],
      });
    });
  }

  public async presentEditImageActionSheet(
    file: File,
    onImageDeleted?: () => void,
  ): Promise<void> {
    let actionSheetElement: HTMLIonActionSheetElement | undefined;
    actionSheetElement = await this.dialogService.presentActionSheet({
      buttons: [
        {
          text: this.translocoService.translate(
            'domain.vehicles.dialog.editImage.button.open',
          ),
          handler: (): void => {
            void this.downloadAndOpenFile(file);
          },
        },
        {
          text: this.translocoService.translate(
            'domain.vehicles.dialog.editImage.button.delete',
          ),
          handler: (): void => {
            if (onImageDeleted) {
              onImageDeleted();
            }
          },
          role: 'destructive',
        },
        {
          text: this.translocoService.translate(
            'domain.vehicles.dialog.editImage.button.cancel',
          ),
          role: 'cancel',
        },
      ],
    });
  }

  public async presentEditInvoiceActionSheet(
    file: File,
    onInvoiceDeleted?: () => void,
  ): Promise<void> {
    await this.dialogService.presentActionSheet({
      buttons: [
        {
          text: this.translocoService.translate(
            'domain.vehicles.dialog.editInvoice.button.open',
          ),
          handler: (): void => {
            void this.downloadAndOpenFile(file);
          },
        },
        {
          text: this.translocoService.translate(
            'domain.vehicles.dialog.editInvoice.button.delete',
          ),
          handler: (): void => {
            if (onInvoiceDeleted) {
              onInvoiceDeleted();
            }
          },
          role: 'destructive',
        },
        {
          text: this.translocoService.translate(
            'domain.vehicles.dialog.editInvoice.button.cancel',
          ),
          role: 'cancel',
        },
      ],
    });
  }

  public async presentUnsavedChangesAlert(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      void this.dialogService.presentAlert({
        header: this.translocoService.translate(
          'core.dialog.unsavedChanges.header',
        ),
        message: this.translocoService.translate(
          'core.dialog.unsavedChanges.message',
        ),
        buttons: [
          {
            text: this.translocoService.translate(
              'core.dialog.unsavedChanges.button.cancel',
            ),
            role: 'cancel',
            handler: (): void => {
              resolve(false);
            },
          },
          {
            text: this.translocoService.translate(
              'core.dialog.unsavedChanges.button.continue',
            ),
            role: 'destructive',
            handler: (): void => {
              resolve(true);
            },
          },
        ],
      });
    });
  }

  public async presentVehicleModelAxlesAlert(
    axles: VehicleModelAxles,
  ): Promise<VehicleModelAxles> {
    const element = await this.dialogService.presentAlert({
      header: this.translocoService.translate(
        'domain.vehicles.dialog.vehicleModelAxles.header',
      ),
      inputs: [
        {
          name: 'total',
          type: 'number',
          value: axles.total,
          placeholder: this.translocoService.translate(
            'domain.vehicles.dialog.vehicleModelAxles.label.total',
          ),
        },
        {
          name: 'powered',
          type: 'number',
          value: axles.powered,
          placeholder: this.translocoService.translate(
            'domain.vehicles.dialog.vehicleModelAxles.label.powered',
          ),
        },
        {
          name: 'tractioned',
          type: 'number',
          value: axles.tractioned,
          placeholder: this.translocoService.translate(
            'domain.vehicles.dialog.vehicleModelAxles.label.tractioned',
          ),
        },
      ],
      buttons: [
        {
          text: this.translocoService.translate(
            'domain.vehicles.dialog.vehicleModelAxles.button.cancel',
          ),
          role: 'cancel',
        },
        {
          text: this.translocoService.translate(
            'domain.vehicles.dialog.vehicleModelAxles.button.save',
          ),
        },
      ],
      backdropDismiss: false,
    });
    const result = await element.onDidDismiss();
    if (result.role === 'cancel') {
      return axles;
    } else {
      return {
        total: result.data.values.total
          ? Number.parseInt(result.data.values.total, 10)
          : null,
        powered: result.data.values.powered
          ? Number.parseInt(result.data.values.powered, 10)
          : null,
        tractioned: result.data.values.tractioned
          ? Number.parseInt(result.data.values.tractioned, 10)
          : null,
      };
    }
  }

  public throwErrorAndNavigateToVehicleListPage(): void {
    void this.navigateToVehicleListPage();
    this.throwVehicleNotFoundError();
  }

  public updateVehicleById(
    id: string,
  ): MutationResult<void, Error, UpdateVehicleOptions, unknown> {
    return this.#mutation({
      mutationFn: (options: UpdateVehicleOptions) =>
        this.vehicleService.updateById(id, options),
      onSuccess: () => {
        void this.#client.invalidateQueries({ queryKey: ['vehicles'] });
      },
    });
  }

  private async downloadAndOpenFile(file: File): Promise<void> {
    let blob = file.blob;
    let path = file.path;
    if (!blob && !path && file.id) {
      const { file: downloadedFile } = await this.apiFilesService.download({
        id: file.id,
      });
      blob = downloadedFile.blob;
      path = downloadedFile.path;
    }
    await this.fileOpenerService.openFile({
      blob,
      path,
    });
  }

  private throwVehicleNotFoundError(): void {
    const message = this.translocoService.translate(
      'domain.vehicles.message.error.notFound',
    );
    throw new Error(message);
  }
}
