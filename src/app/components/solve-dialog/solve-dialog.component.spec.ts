import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolveDialogComponent } from './solve-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';

describe('SolveDialogComponent', () => {
  let component: SolveDialogComponent;
  let fixture: ComponentFixture<SolveDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<DialogRef>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ SolveDialogComponent ],
      providers: [
        { provide: DialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with confirm: false when cancel is called', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ confirm: false });
  });

  it('should close dialog with confirm: true when confirm is called', () => {
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({ confirm: true });
  });
});
