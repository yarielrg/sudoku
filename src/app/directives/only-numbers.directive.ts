import { Directive, ElementRef, EventEmitter, HostListener, Output, inject, HostBinding, input } from '@angular/core';

@Directive({
  selector: 'input[onlyNumbers]'
})
export class OnlyNumbersDirective {
  private _invalid = false;

  disabled = input<boolean>(false);

  @HostBinding('class.is-invalid')
  get invalid() {
    return this._invalid;
  }

  set invalid(value: boolean) {
    this._invalid = value;
  }

  @HostBinding('disabled')
  get isDisabled(): boolean {
    return this.invalid ? false : this.disabled();
  }

  @Output() valueChange = new EventEmitter<{ value: string, validation: OnlyNumbersDirective }>();

  private readonly el = inject(ElementRef);

  @HostListener('input', ['$event'])
  private onInputChange(event: Event) {
    const initalValue = this.el.nativeElement.value;
    const newValue = initalValue.replace(/[^1-9]*/g, '');
    this.el.nativeElement.value = newValue;
    this.valueChange.emit({ value: newValue, validation: this });
    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
