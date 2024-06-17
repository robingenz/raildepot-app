import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, mergeMap } from 'rxjs';
import { FirebaseAuthenticationService } from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
  ) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return from(this.getIdToken()).pipe(
      mergeMap(idToken => {
        if (idToken) {
          const headers = new HttpHeaders({
            Authorization: 'Bearer ' + idToken,
          });
          const requestClone = request.clone({ headers });
          return next.handle(requestClone);
        } else {
          return next.handle(request);
        }
      }),
    );
  }

  private async getIdToken(): Promise<string | null> {
    const result = await this.firebaseAuthenticationService.getIdToken();
    return result.token;
  }
}

// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };
