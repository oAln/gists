import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMinMax]',
  standalone: true
})
export class MinMaxDirective {
  @Input()
  public min: number;

  @Input()
  public max: number;

  constructor(private ref: ElementRef) {}

  @HostListener('input', ['$event'])
  public onInput(event: InputEvent): void {
    const val = parseInt(this.ref.nativeElement.value);
    if (this.max && val >= this.max) this.ref.nativeElement.value = this.max.toString();
    else if (this.min && val <= this.min) this.ref.nativeElement.value = this.min.toString();
  }
}
