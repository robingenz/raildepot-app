import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { lastValueFrom } from 'rxjs';

export type CreateVehicleDto = Omit<
  VehicleDto,
  'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'deletedAt'
>;

export interface FindAllVehiclesDto {
  limit?: number;
  offset?: number;
}

export interface UpdateVehicleDto extends CreateVehicleDto {
  id: string;
}

export interface VehicleDto {
  id: string;
  additionalName: string | null;
  category: string | null;
  classNumber: number | null;
  company: string | null;
  digital: {
    decoderAddress: number | null;
    decoderName: string | null;
  };
  imageFileIds: string[] | null;
  inventoryNumber: string | null;
  model: {
    articleNumber: string | null;
    axlesTotal: number | null;
    axlesPowered: number | null;
    axlesTractioned: number | null;
    epoch: string | null;
    gauge: string | null;
    hasLight: boolean | null;
    hasOriginalBox: boolean | null;
    hasSmoke: boolean | null;
    hasSound: boolean | null;
    isLimited: boolean | null;
    length: number | null;
    manufacturer: string | null;
    serialNumber: string | null;
    weight: number | null;
  };
  name: string;
  note: string | null;
  purchase: {
    date: string | null;
    invoiceNumber: string | null;
    invoiceFileId: string | null;
    location: string | null;
    msrp: number | null;
    price: number | null;
  };
  quantity: number | null;
  serialNumber: number | null;
  storage: {
    storageLocation: string | null;
    installationLocation: string | null;
    condition: string | null;
  };
  type: string | null;
  uic: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ApiVehiclesService {
  private readonly urlPath = '/v1/vehicles';

  constructor(private readonly httpClient: HttpClient) {}

  public create(dto: CreateVehicleDto): Promise<void> {
    const response$ = this.httpClient.post<void>(
      environment.apiBaseUrl + this.urlPath,
      dto,
    );
    return lastValueFrom(response$);
  }

  public deleteById(id: string): Promise<void> {
    const response$ = this.httpClient.delete<void>(
      environment.apiBaseUrl + this.urlPath + '/' + id,
    );
    return lastValueFrom(response$);
  }

  public findAll(options?: FindAllVehiclesDto): Promise<VehicleDto[]> {
    let httpParams = new HttpParams();
    if (options?.limit) {
      httpParams = httpParams.set('limit', options.limit.toString());
    }
    if (options?.offset) {
      httpParams = httpParams.set('offset', options.offset.toString());
    }
    const response$ = this.httpClient.get<VehicleDto[]>(
      environment.apiBaseUrl + this.urlPath,
      {
        params: httpParams,
      },
    );
    return lastValueFrom(response$);
  }

  public findOneById(id: string): Promise<VehicleDto> {
    const response$ = this.httpClient.get<VehicleDto>(
      environment.apiBaseUrl + this.urlPath + '/' + id,
    );
    return lastValueFrom(response$);
  }

  public updateById(dto: UpdateVehicleDto): Promise<void> {
    const response$ = this.httpClient.put<void>(
      environment.apiBaseUrl + this.urlPath + '/' + dto.id,
      dto,
    );
    return lastValueFrom(response$);
  }
}
