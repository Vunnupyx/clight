import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss']
})
export class LoadingDialogComponent implements OnInit {
  message: string;

  constructor(
    public dialogRef: MatDialogRef<LoadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoadingDialogModel
  ) {
    this.message = data.message;
  }

  ngOnInit() {}
}

export class LoadingDialogModel {
  constructor(public message: string) {}
}
