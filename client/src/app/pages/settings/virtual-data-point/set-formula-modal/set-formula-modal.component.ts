import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SourceDataPoint, VirtualDataPoint } from 'app/models';
import { SourceDataPointService, VirtualDataPointService } from 'app/services';
import { Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

export interface SetFormulaModalData {
  sources?: string[];
  formula: string;
}

const Operators = [
  '*',
  '/',
  '%',
  '-',
  '+',
  '(',
  ')'
];

@Component({
  selector: 'app-set-formula-modal',
  templateUrl: './set-formula-modal.component.html',
  styleUrls: ['./set-formula-modal.component.scss']
})
export class SetFormulaModalComponent implements OnInit, OnDestroy {
  Operators = Operators;

  sourceOptions?: SourceDataPoint[];

  sub = new Subscription();

  formula: string;

  @ViewChild('formulaInput') formulaInputRef: ElementRef<HTMLInputElement>;

  constructor(
    private dialogRef: MatDialogRef<
      SetFormulaModalComponent,
      SetFormulaModalData
    >,
    @Inject(MAT_DIALOG_DATA) public data: SetFormulaModalData,
    private sourceDataPointService: SourceDataPointService,
    private virtualDataPointService: VirtualDataPointService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.sourceDataPointService.dataPoints
        .pipe(withLatestFrom(this.virtualDataPointService.dataPoints))
        .subscribe(([sourceDataPoints, virtualDataPoints]) =>
          this.onDataPoints(sourceDataPoints, virtualDataPoints)
        )
    );

    this.formula = this.deserializeFormula(this.data.formula);
  }

  onSave() {
    this.dialogRef.close({
      formula: this.serializeFormula(this.formula)
    });
  }
  
  onCancel() {
    this.dialogRef.close();
  }

  getSourcePrefix(source: SourceDataPoint | VirtualDataPoint) {
    if ((source as SourceDataPoint).address) {
      return this.sourceDataPointService.getPrefix(source.id);
    }
    return this.virtualDataPointService.getPrefix();
  }

  onDataPointSelected(dataPointName: string) {
    this.typeAsSeparateWord(
      this.escapeDataPointName(dataPointName),
      this.formulaInputRef.nativeElement
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private onDataPoints(
    sourceDataPoints: SourceDataPoint[],
    virtualDataPoints: VirtualDataPoint[]
  ) {
    if (!sourceDataPoints?.length) {
      return;
    }
    const dictionaries = [
      ...(sourceDataPoints || []),
      ...(virtualDataPoints || [])
    ];

    this.sourceOptions = this.data.sources
      ?.map(
        (sourceId) =>
          dictionaries.find((obj) => obj.id === sourceId) as SourceDataPoint
      )
      .filter(Boolean);
  }

  private escapeDataPointName(str: string) {
    return str.replace(/\s+/g, '_');
  }

  private typeAsSeparateWord(str: string, el: HTMLInputElement) {
    const [start, end] = [el.selectionStart, el.selectionEnd];
    if (start !== 0) {
      str = ' ' + str;
    }
    el.setRangeText(str, start, end, 'end');
    el.focus();
  }

  private serializeFormula(formula: string) {
    let rawFormula = formula;
    for (const dp of this.sourceOptions) {
      rawFormula = rawFormula.replace(new RegExp(this.escapeDataPointName(dp.name), 'g'), dp.id);
    }
    return rawFormula;
  }

  private deserializeFormula(rawFormula: string) {
    let formula = rawFormula;
    for (const dp of this.sourceOptions) {
      formula = formula.replace(new RegExp(dp.id, 'g'), this.escapeDataPointName(dp.name));
    }
    return formula;
  }

}
