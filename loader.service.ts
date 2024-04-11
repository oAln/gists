import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loaderSubject$ = new BehaviorSubject<boolean>(false);
  loaderObsv$ = this.loaderSubject$.asObservable();
  private progressSubject$ = new BehaviorSubject<string>('');
  progressObsv$ = this.progressSubject$.asObservable();

  toggleLoader(status: boolean) {
    this.loaderSubject$.next(status);
  }

  showProgress(progress) {
    this.progressSubject$.next(progress);
  }
}


// Component
loader$: Observable<boolean> = this.loaderService.loaderObsv$;

// HTML
<div *ngIf="(loader$ | async) || navigationLoader">
  <div class="spinner-border custom-loader" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <p *ngIf="progress" class="progress-block">{{ progress | number: '1.2-2' }} %</p>
</div>

// SCSS 
.custom-loader {
    width: 70px;
    height: 70px;
    left: 50%;
    top: 50%;
    position: absolute;
    z-index: 999;
    border-color: $loader-border-color;
    border-right-color: transparent;
  }