import { Injectable } from '@angular/core';
import {
  ApiVehiclesService,
  CreateVehicleDto,
  FindAllVehiclesDto,
  VehicleDto,
} from '@app/domains/vehicles/services/api';
import {
  VehicleCategory,
  VehicleCondition,
  VehicleEpoch,
  VehicleGauge,
} from '../../enums';
import { Vehicle } from '../../interfaces';

export type CreateVehicleOptions = Omit<
  Vehicle,
  'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt'
>;
export type UpdateVehicleOptions = CreateVehicleOptions;
export type FindAllVehiclesOptions = FindAllVehiclesDto;

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  constructor(private readonly apiVehiclesService: ApiVehiclesService) {}

  public async create(options: CreateVehicleOptions): Promise<void> {
    const dto = this.convertVehicleToCreateVehicleDto(options);
    await this.apiVehiclesService.create(dto);
  }

  public async deleteById(id: string): Promise<void> {
    await this.apiVehiclesService.deleteById(id);
  }

  public async findAll(options?: FindAllVehiclesOptions): Promise<Vehicle[]> {
    const dtos = await this.apiVehiclesService.findAll(options);
    return dtos.map(dto => this.convertVehicleDtoToVehicle(dto));
  }

  public async findOneById(id: string): Promise<Vehicle> {
    const dto = await this.apiVehiclesService.findOneById(id);
    return this.convertVehicleDtoToVehicle(dto);
  }

  public async updateById(
    id: string,
    options: UpdateVehicleOptions,
  ): Promise<void> {
    return this.apiVehiclesService.updateById(id, options);
  }

  private convertVehicleToCreateVehicleDto(
    vehicle: CreateVehicleOptions,
  ): CreateVehicleDto {
    const dto: CreateVehicleDto = {
      ...vehicle,
      category: vehicle.category ?? null,
    };
    return dto;
  }

  private convertVehicleDtoToVehicle(dto: VehicleDto): Vehicle {
    const vehicle: Vehicle = {
      ...dto,
      category: this.convertStringToVehicleCategory(dto.category),
      model: {
        ...dto.model,
        epoch: this.convertStringToVehicleEpoch(dto.model?.epoch ?? null),
        gauge: this.convertStringToVehicleGauge(dto.model?.gauge ?? null),
      },
      storage: {
        ...dto.storage,
        condition: this.convertStringToVehicleCondition(
          dto.storage?.condition ?? null,
        ),
      },
    };
    return vehicle;
  }

  private convertStringToVehicleCategory(
    value: string | null | undefined,
  ): VehicleCategory | null {
    switch (value) {
      case VehicleCategory.Locomotive: {
        return VehicleCategory.Locomotive;
      }
      case VehicleCategory.Railcar: {
        return VehicleCategory.Railcar;
      }
      case VehicleCategory.Wagon: {
        return VehicleCategory.Wagon;
      }
      default: {
        return null;
      }
    }
  }

  private convertStringToVehicleCondition(
    value: string | null,
  ): VehicleCondition | null {
    switch (value) {
      case VehicleCondition.New: {
        return VehicleCondition.New;
      }
      case VehicleCondition.UsedVeryGood: {
        return VehicleCondition.UsedVeryGood;
      }
      case VehicleCondition.UsedGood: {
        return VehicleCondition.UsedGood;
      }
      case VehicleCondition.UsedAcceptable: {
        return VehicleCondition.UsedAcceptable;
      }
      default: {
        return null;
      }
    }
  }

  private convertStringToVehicleEpoch(
    value: string | null,
  ): VehicleEpoch | null {
    switch (value) {
      case VehicleEpoch.I: {
        return VehicleEpoch.I;
      }
      case VehicleEpoch.Ii: {
        return VehicleEpoch.Ii;
      }
      case VehicleEpoch.Iii: {
        return VehicleEpoch.Iii;
      }
      case VehicleEpoch.Iv: {
        return VehicleEpoch.Iv;
      }
      case VehicleEpoch.V: {
        return VehicleEpoch.V;
      }
      case VehicleEpoch.Vi: {
        return VehicleEpoch.Vi;
      }
      default: {
        return null;
      }
    }
  }

  private convertStringToVehicleGauge(
    value: string | null,
  ): VehicleGauge | null {
    switch (value) {
      case VehicleGauge.H0: {
        return VehicleGauge.H0;
      }
      case VehicleGauge.N: {
        return VehicleGauge.N;
      }
      case VehicleGauge.Tt: {
        return VehicleGauge.Tt;
      }
      case VehicleGauge.Z: {
        return VehicleGauge.Z;
      }
      case VehicleGauge.I: {
        return VehicleGauge.I;
      }
      case VehicleGauge.Ii: {
        return VehicleGauge.Ii;
      }
      case VehicleGauge.O: {
        return VehicleGauge.O;
      }
      case VehicleGauge.OO: {
        return VehicleGauge.OO;
      }
      case VehicleGauge.S: {
        return VehicleGauge.S;
      }
      default: {
        return null;
      }
    }
  }
}
