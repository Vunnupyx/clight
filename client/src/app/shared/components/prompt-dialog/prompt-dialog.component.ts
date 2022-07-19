import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent implements OnInit {
  title: string;
  message: string;
  inputValue!: string;

  constructor(
    public dialogRef: MatDialogRef<PromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogModel
  ) {
    this.title = data.title;
    this.message = data.message;
    this.inputValue = data.inputValue;
  }

  ngOnInit() {}

  onConfirm(): void {
    this.dialogRef.close(this.inputValue);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}

export interface PromptDialogModel {
  title: string;
  message: string;
  inputValue: string;
}
