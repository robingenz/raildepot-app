import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { lastValueFrom } from 'rxjs';

export interface UploadFileDto {
  file: Blob;
}

@Injectable({
  providedIn: 'root',
})
export class ApiFilesService {
  private readonly urlPath = '/v1/files';

  constructor(private readonly httpClient: HttpClient) {}

  public upload(dto: UploadFileDto): Promise<void> {
    const formData = new FormData();
    formData.append('file', dto.file);

    const response$ = this.httpClient.post<void>(
      environment.apiBaseUrl + this.urlPath,
      formData,
    );
    return lastValueFrom(response$);
  }
}
