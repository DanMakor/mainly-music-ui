import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'mm-confirmation.modal',
  templateUrl: './confirmation.modal.component.html',
  styleUrls: ['./confirmation.modal.component.scss']
})
export class ConfirmationModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, paragraphs: string[] }
  ) {}
}
