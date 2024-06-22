import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File } from '@app/core/interfaces';
import { environment } from '@env/environment';
import { lastValueFrom } from 'rxjs';
import { FileTransferService } from '../../file';

export interface DownloadFileDto {
  id: string;
}

export interface DownloadFileResult {
  file: File;
}

export interface FileDto {
  id: string;
  /**
   * File extension without dot.
   *
   * @example 'pdf'
   */
  extension: string;
  /**
   * File name without extension.
   *
   * @example 'invoice'
   */
  name: string;
  /**
   * File size in bytes.
   *
   * @example 1024
   */
  size: number;
  /**
   * MIME type.
   *
   * @example 'application/pdf'
   */
  type: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string | null;
}

export interface CreateFileDto {
  file: Blob;
}

@Injectable({
  providedIn: 'root',
})
export class ApiFilesService {
  private readonly urlPath = '/v1/files';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly fileTransferService: FileTransferService,
  ) {}

  public create(dto: CreateFileDto): Promise<FileDto> {
    const formData = new FormData();
    formData.append('file', dto.file);

    const response$ = this.httpClient.post<FileDto>(
      environment.apiBaseUrl + this.urlPath,
      formData,
    );
    return lastValueFrom(response$);
  }

  public async download(dto: DownloadFileDto): Promise<DownloadFileResult> {
    const file = await this.findOneById(dto.id);
    const path = `files/${dto.id}/${file.name}.${file.extension}`; // -> FileHelperService
    const url =
      environment.apiBaseUrl + this.urlPath + '/' + dto.id + '/download';
    return this.fileTransferService.download({
      path,
      url,
    });
  }

  public findOneById(id: string): Promise<FileDto> {
    const response$ = this.httpClient.get<FileDto>(
      environment.apiBaseUrl + this.urlPath + '/' + id,
    );
    return lastValueFrom(response$);
  }
}
