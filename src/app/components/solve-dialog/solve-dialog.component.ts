import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-solve-dialog',
  templateUrl: './solve-dialog.component.html',
  styleUrls: ['./solve-dialog.component.scss']
})
export class SolveDialogComponent {

  data: { mainText: string, subText?: string } = inject(DIALOG_DATA);
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
