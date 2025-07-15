import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-solve-dialog',
  templateUrl: './solve-dialog.component.html',
  styleUrls: ['./solve-dialog.component.scss']
})
export class SolveDialogComponent {

  private readonly dialogRef = inject(DialogRef);

  cancel(): void {
    this.dialogRef.close({
      confirm: false
    });
  }

  confirm(): void {
    this.dialogRef.close({
      confirm: true
    });
  } 
}
