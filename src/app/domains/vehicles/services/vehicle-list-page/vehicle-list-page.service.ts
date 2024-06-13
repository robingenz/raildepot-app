import { Injectable } from '@angular/core';
import { DialogService, RouterService } from '@app/core';
import {
  Vehicle,
  VehicleService,
} from '@app/domains/vehicles/services/vehicle/vehicle.service';
import { TranslocoService } from '@jsverse/transloco';
import {
  InfiniteData,
  InfiniteQueryObserverResult,
  injectInfiniteQuery,
  injectQueryClient,
} from '@ngneat/query';
import { Result } from '@ngneat/query/lib/types';

@Injectable({
  providedIn: 'root',
})
export class VehicleListPageService {
  #client = injectQueryClient();
  #query = injectInfiniteQuery();

  constructor(
    private readonly routerService: RouterService,
    private readonly vehicleService: VehicleService,
    private readonly dialogService: DialogService,
    private readonly translocoService: TranslocoService,
  ) {}

  public getVehicles(options: {
    limit: number;
  }): Result<InfiniteQueryObserverResult<InfiniteData<Vehicle[], Error>>> {
    return this.#query({
      queryKey: ['vehicles'],
      queryFn: ({ pageParam }) =>
        this.vehicleService.findAll({
          limit: options.limit,
          offset: pageParam * options.limit,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParams) => {
        if (lastPage.length === 0) {
          return;
        }
        return lastPageParams + 1;
      },
      getPreviousPageParam: (firstPage, allPages, lastPageParams) => {
        if (lastPageParams <= 1) {
          return;
        }
        return lastPageParams - 1;
      },
    });
  }

  public async presentVehicleDeleteAlert(vehicleId: string): Promise<void> {
    const alertElement = await this.dialogService.presentAlert({
      header: this.translocoService.translate(
        'vehicles.dialog.deleteVehicle.header',
      ),
      message: this.translocoService.translate(
        'vehicles.dialog.deleteVehicle.message',
      ),
      buttons: [
        {
          text: this.translocoService.translate(
            'vehicles.dialog.deleteVehicle.button.cancel',
          ),
          role: 'cancel',
        },
        {
          text: this.translocoService.translate(
            'vehicles.dialog.deleteVehicle.button.delete',
          ),
          role: 'destructive',
          handler: (): void => {
            void this.deleteVehicleById(vehicleId);
          },
        },
      ],
    });
    await alertElement.present();
  }

  public async refetchVehicles(): Promise<void> {
    this.#client.setQueryData<InfiniteData<Vehicle[], unknown>>(
      ['vehicles'],
      data => {
        if (data) {
          return {
            pages: data.pages.slice(0, 1),
            pageParams: data.pageParams.slice(0, 1),
          };
        } else {
          return data;
        }
      },
    );
    await this.#client.refetchQueries({ queryKey: ['vehicles'] });
  }

  public async navigateToVehicleUpsertPage(taskId?: string): Promise<void> {
    await this.routerService.navigateToVehicleUpsertPage(taskId);
  }

  private async deleteVehicleById(id: string): Promise<void> {
    const loadingElement = await this.dialogService.presentLoading();
    try {
      await this.vehicleService.deleteById(id);
      await this.#client.invalidateQueries({ queryKey: ['vehicles'] });
    } finally {
      await loadingElement.dismiss();
    }
  }
}
