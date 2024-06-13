import { Injectable } from '@angular/core';
import {
  ApiVehiclesService,
  CreateVehicleDto,
  FindAllVehiclesDto,
  UpdateVehicleDto,
  VehicleDto,
} from '@app/domains/vehicles/services/api';

export type CreateVehicleOptions = CreateVehicleDto;
export type UpdateVehicleOptions = UpdateVehicleDto;
export type FindAllVehiclesOptions = FindAllVehiclesDto;
export type Vehicle = VehicleDto;

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  constructor(private readonly apiVehiclesService: ApiVehiclesService) {}

  public async create(options: CreateVehicleOptions): Promise<void> {
    return this.apiVehiclesService.create(options);
  }

  public async deleteById(id: string): Promise<void> {
    return this.apiVehiclesService.deleteById(id);
  }

  public async findAll(options?: FindAllVehiclesOptions): Promise<Vehicle[]> {
    return this.apiVehiclesService.findAll(options);
  }

  public async findOneById(id: string): Promise<Vehicle> {
    return this.apiVehiclesService.findOneById(id);
  }

  public async updateById(options: UpdateVehicleOptions): Promise<void> {
    return this.apiVehiclesService.updateById(options);
  }
}
