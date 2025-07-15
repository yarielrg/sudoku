import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OnlyNumbersDirective } from './only-numbers.directive';

@Component({
  standalone: true,
  template: `<input type="text" onlyNumbers />`,
  imports: [OnlyNumbersDirective]
})
class TestComponent {}

describe('OnlyNumbersDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let input: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should allow number input', () => {
    const event = new KeyboardEvent('keydown', { key: '5' });
    const preventDefaultSpy = spyOn(event, 'preventDefault');
    input.dispatchEvent(event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should block non-number input', () => {
    input.value = '';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    input.value += 'a';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('');
  });

  it('should allow navigation keys', () => {
    const keys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    for (const key of keys) {
      const event = new KeyboardEvent('keydown', { key });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      input.dispatchEvent(event);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    }
  });
});
