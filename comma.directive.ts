import { Directive, ElementRef, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable, fromEvent } from 'rxjs';

@Directive({
  selector: '[appComma]',
  standalone: true,
  providers: [DecimalPipe]
})
export class CommaDirective implements OnInit {
  inputChange$: Observable<object>;
  numberValue: number;
  commasFormatted = 0;

  constructor(
    private element: ElementRef,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit() {
    this.inputChange$ = fromEvent(this.element.nativeElement, 'input');
    this.inputChange$.subscribe((inputValue) => {
      this.formatInputValue(inputValue);
    });
  }

  formatInputValue(inputValue) {
    let numVal = this.numberValue;
    const keyboardEvt = inputValue as KeyboardEvent;
    const inputTarget = keyboardEvt.target as HTMLInputElement;
    const cursorPos = inputTarget.selectionStart;
    const selEnd = inputTarget.selectionEnd;
    const value = inputTarget.value;
    if (value?.length) {
      numVal = parseInt(value.replace(/,/g, ''));
      const formatted = this.decimalPipe.transform(numVal, '1.0-0').toString();
      this.element.nativeElement.value = formatted;

      const formattedToLeftOfCursor = formatted.substring(0, cursorPos);
      this.commasFormatted = formattedToLeftOfCursor.split(',').length - 1;
      const valToLeftOfCursor = value.substring(0, cursorPos);
      const commasInVal = valToLeftOfCursor.split(',').length - 1;
      if (cursorPos === selEnd) {
        const setPos = cursorPos + this.commasFormatted - commasInVal;
        this.element.nativeElement.setSelectionRange(setPos, setPos);
      }
    }
    this.numberValue = numVal;
  }
}
