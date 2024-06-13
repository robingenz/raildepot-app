import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorParserService {
  constructor() {}

  public getCodeFromUnknownError(error: unknown): string | undefined {
    error = this.getOriginalError(error);
    let code: string | undefined;
    if (error instanceof Object && 'code' in error) {
      code = error.code + '';
    }
    return code;
  }

  public getMessageFromUnknownError(error: unknown): string {
    error = this.getOriginalError(error);
    let message = 'An unknown error has occurred.';
    if (error instanceof Error && error.message) {
      message = error.message;
    }
    return message;
  }

  private getOriginalError(error: unknown): unknown {
    if (error instanceof Object && 'rejection' in error) {
      error = (error as any).rejection;
    }
    return error;
  }
}
