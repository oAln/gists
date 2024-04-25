import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InterceptorContextService {
  private setDefaultLoaderSubject$ = new BehaviorSubject<boolean>(false);
  setDefaultLoaderObsv$ = this.setDefaultLoaderSubject$.asObservable();

  setInterceptorContext(status: boolean) {
    this.setDefaultLoaderSubject$.next(status);
  }
}


// this.interceptorContextService.setInterceptorContext(true);