import { Directive, ElementRef, Output } from '@angular/core';
import { AppConstants } from '@util/constant';
import { fromEvent, throttleTime, debounceTime } from 'rxjs';

const IDLE_TIME = AppConstants.CLICK_IDLE_TIME;

@Directive({
  selector: '[click.throttle], [click.debounce]', // eslint-disable-line
  standalone: true
})
export class ClickDelayControlDirective {
  @Output('click.throttle') throttledClicks$ = fromEvent(this.el.nativeElement, 'click').pipe(throttleTime(IDLE_TIME));

  @Output('click.debounce') debouncedClicks$ = fromEvent(this.el.nativeElement, 'click').pipe(debounceTime(IDLE_TIME));

  constructor(private el: ElementRef) {}
}


// <button
//         (click.throttle)="btnAction(btn.action)"
//       >
//         button
//       </button>