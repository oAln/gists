import {
    HttpContextToken,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable, finalize, delay, catchError } from 'rxjs';
  import { LoaderService } from '../loader/loader.service';
  import { AuthService } from '../auth-service/auth.service';
  import { environment } from 'environments/environment';
  import { InterceptorContextService } from './interceptor-context.service';
  import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  
  interface APIRequest {
    requestCount: number;
    req: HttpRequest<any>;
  }
  export const SET_AUTO_LOADER = new HttpContextToken(() => true);
  
  @Injectable()
  export class InterceptorService implements HttpInterceptor {
    constructor(
      private loaderService: LoaderService,
      private authService: AuthService,
      private interceptorContextService: InterceptorContextService
    ) {
      this.interceptorContextService.setDefaultLoaderObsv$.pipe(takeUntilDestroyed()).subscribe((status) => {
        this.showDefaultLoader = status;
      });
    }
    inProgressRequests: APIRequest[] = [];
    requestCount = 0;
    showDefaultLoader = true;
  
    removeRequest(modifiedReq: APIRequest) {
      let pendingRequest = false;
      const reqIndex = this.inProgressRequests.findIndex(
        (index) =>
          index.req.url === modifiedReq.req.url &&
          index.req.method === modifiedReq.req.method &&
          index.requestCount === modifiedReq.requestCount
      );
      if (reqIndex > -1) {
        this.inProgressRequests.splice(reqIndex, 1);
      }
      pendingRequest = this.inProgressRequests.length > 0;
      if (this.showDefaultLoader) {
        this.loaderService.toggleLoader(pendingRequest);
      } else {
        this.loaderService.toggleLoader(true);
      }
    }
  
    addRequest(modifiedReq: APIRequest) {
      this.inProgressRequests.push(modifiedReq);
      this.loaderService.toggleLoader(true);
    }
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.showDefaultLoader = req.context.get(SET_AUTO_LOADER);
      this.requestCount = this.requestCount + 1;
      const modifiedReq = {
        ...{ requestCount: this.requestCount },
        ...{ req }
      };
  
      const isRefreshTokenRequest = req.url === `${environment.apiUrl}/auth/refresh-token`;
      if (!isRefreshTokenRequest) {
        this.addRequest(modifiedReq);
      }
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
            return [];
          }
          throw error;
        }),
        delay(1 * 100),
        finalize(() => {
          this.removeRequest(modifiedReq);
        })
      );
    }
  }
  