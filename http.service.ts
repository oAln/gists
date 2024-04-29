import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpContext } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { SET_AUTO_LOADER } from '../interceptor/interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {
  private url: string;

  alertClass: string;
  alertTag: string;
  notification: string;
  notificationCode: string;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => error.error || 'server error');
  }

  get(...args) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.http.get(...args).pipe(catchError(this.errorHandler));
  }

  addSessionId(headerObj) {
    const user = this.localStorageService.get('user');
    if (user && user['sessionId']) {
      headerObj['sessionid'] = user['sessionId'];
    }
  }

  requestHandler(
    methodType,
    apiLink,
    apiEndPoint,
    apiBody = {},
    headerObj?,
    options?,
    isMultipart?,
    defaultLoader = true
  ) {
    headerObj = headerObj ? headerObj : { 'Content-Type': 'application/json' };
    this.addSessionId(headerObj);
    // headerObj['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders(headerObj);
    methodType = methodType ? methodType : 'post';
    if (methodType === 'get') {
      return this.http
        .get(apiLink + apiEndPoint, {
          headers: headers,
          withCredentials: true,
          context: new HttpContext().set(SET_AUTO_LOADER, defaultLoader)
        })
        .pipe(catchError(this.errorHandler));
    } else if (methodType === 'delete') {
      const options = {
        headers: headers,
        withCredentials: true,
        body: apiBody,
        context: new HttpContext().set(SET_AUTO_LOADER, defaultLoader)
      };

      return this.http.delete(apiLink + apiEndPoint, options).pipe(catchError(this.errorHandler));
    } else {
      let httpOptions;
      if (isMultipart) {
        httpOptions = {
          'Content-Type': 'multipart/form-data',
          headers: {},
          context: new HttpContext().set(SET_AUTO_LOADER, defaultLoader)
        };
        this.addSessionId(httpOptions.headers);
      } else {
        httpOptions = options
          ? { headers, ...options, context: new HttpContext().set(SET_AUTO_LOADER, defaultLoader) }
          : { headers, withCredentials: true, context: new HttpContext().set(SET_AUTO_LOADER, defaultLoader) };
      }

      return this.http[methodType](apiLink + apiEndPoint, apiBody, httpOptions).pipe(catchError(this.errorHandler));
    }
  }
}
