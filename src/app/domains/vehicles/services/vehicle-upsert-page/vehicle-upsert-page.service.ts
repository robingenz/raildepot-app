import { Injectable } from '@angular/core';
import { DialogService, RouterService } from '@app/core';
import { TranslocoService } from '@jsverse/transloco';
import {
  MutationResult,
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@ngneat/query';
import { Result } from '@ngneat/query/lib/types';
import { QueryObserverResult } from '@tanstack/query-core';
import { Vehicle } from '../../interfaces';
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

  public getVehicleById(
    id: string,
  ): Result<QueryObserverResult<Vehicle | null, Error>> {
    return this.#query({
      queryKey: ['vehicles', id],
      queryFn: () => this.vehicleService.findOneById(id),
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

  public async navigateToVehicleListPage(): Promise<void> {
    await this.routerService.navigateToVehicleListPage({
      animationDirection: 'back',
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

  private throwVehicleNotFoundError(): void {
    const message = this.translocoService.translate(
      'domain.vehicles.message.error.notFound',
    );
    throw new Error(message);
  }
}
