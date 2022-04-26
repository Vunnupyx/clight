import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

export interface AlertDialogModel {
  type: MessageDialogType;
  title: string;
  content: string;
  confirmText: string;
  cancelText?: string;
  hideCancelButton?: boolean;
  showCloseButton?: boolean;
}

export type MessageDialogType =
  'success'
  | 'error'
  | 'question'
  | 'info'
  | 'warning';

const typePlaceHolder: string = '%type%';
const classNamePre: string = 'swal2';

const classNameAnimate: string = [
  classNamePre,
  'animate',
  typePlaceHolder,
  'icon'
].join('-');

@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit, OnDestroy {

  type!: MessageDialogType;
  classNames!: string;
  sub = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogModel,
  ) {}

  ngOnInit(): void {
    this.sub.add(this.dialogRef.backdropClick().subscribe(x => this.onBackdropClick(x)));
    this.type = this.data?.type || 'info';
    this.classNames = 
      [
        classNamePre,
        '-',
        this.type,
        ' ',
        classNameAnimate.replace(typePlaceHolder, this.type),
      ].join('');
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeypress(x: KeyboardEvent): void {
    this.dialogRef.close(false);
  }

  onBackdropClick(x: MouseEvent): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
