import { NgModule } from '@angular/core';
import {
  BreakpointClassXxlDirective, BreakpointFillXxlDirective, BreakpointFlexAlignXxlDirective,
  BreakpointFlexXxlDirective, BreakpointHideXxlDirective, BreakpointImgSrcXxlDirective, BreakpointLayoutXxlDirective,
  BreakpointOffsetXxlDirective, BreakpointOrderXxlDirective, BreakpointShowXxlDirective,
  BreakpointStyleXxlDirective
} from './breakpoint-xxl.directive';
import {
  BreakpointClassXxsDirective,
  BreakpointFillXxsDirective,
  BreakpointFlexAlignXxsDirective,
  BreakpointFlexXxsDirective,
  BreakpointHideXxsDirective,
  BreakpointImgSrcXxsDirective,
  BreakpointLayoutXxsDirective,
  BreakpointOffsetXxsDirective,
  BreakpointOrderXxsDirective,
  BreakpointShowXxsDirective,
  BreakpointStyleXxsDirective
} from './breakpoint-xxs.directive';
import { CelosNextBreakPointsProvider } from './celosnext-breakpoints';
import {
  BreakpointClassLtXsDirective,
  BreakpointFillLtXsDirective,
  BreakpointFlexAlignLtXsDirective,
  BreakpointFlexLtXsDirective, BreakpointHideLtXsDirective,
  BreakpointImgSrcLtXsDirective, BreakpointLayoutLtXsDirective,
  BreakpointOffsetLtXsDirective,
  BreakpointOrderLtXsDirective,
  BreakpointShowLtXsDirective, BreakpointStyleLtXsDirective
} from './breakpoint-lt-xs.directive';
import {
  BreakpointClassGtXlDirective,
  BreakpointFillGtXlDirective,
  BreakpointFlexAlignGtXlDirective, BreakpointFlexGtXlDirective, BreakpointHideGtXlDirective,
  BreakpointImgSrcGtXlDirective, BreakpointLayoutGtXlDirective, BreakpointOffsetGtXlDirective,
  BreakpointOrderGtXlDirective, BreakpointShowGtXlDirective, BreakpointStyleGtXlDirective
} from './breakpoint-gt-xl.directive';
import { DmgHeaderComponent } from './dmg-header/dmg-header.component';



@NgModule({
  declarations: [
    BreakpointLayoutXxlDirective,
    BreakpointHideXxlDirective,
    BreakpointShowXxlDirective,
    BreakpointClassXxlDirective,
    BreakpointStyleXxlDirective,
    BreakpointImgSrcXxlDirective,
    BreakpointFlexXxlDirective,
    BreakpointOrderXxlDirective,
    BreakpointOffsetXxlDirective,
    BreakpointFlexAlignXxlDirective,
    BreakpointFillXxlDirective,
    BreakpointLayoutXxsDirective,
    BreakpointHideXxsDirective,
    BreakpointShowXxsDirective,
    BreakpointClassXxsDirective,
    BreakpointStyleXxsDirective,
    BreakpointImgSrcXxsDirective,
    BreakpointFlexXxsDirective,
    BreakpointOrderXxsDirective,
    BreakpointOffsetXxsDirective,
    BreakpointFlexAlignXxsDirective,
    BreakpointFillXxsDirective,
    BreakpointLayoutLtXsDirective,
    BreakpointFillLtXsDirective,
    BreakpointHideLtXsDirective,
    BreakpointShowLtXsDirective,
    BreakpointClassLtXsDirective,
    BreakpointStyleLtXsDirective,
    BreakpointImgSrcLtXsDirective,
    BreakpointFlexLtXsDirective,
    BreakpointOrderLtXsDirective,
    BreakpointOffsetLtXsDirective,
    BreakpointFlexAlignLtXsDirective,
    BreakpointLayoutGtXlDirective,
    BreakpointFillGtXlDirective,
    BreakpointHideGtXlDirective,
    BreakpointShowGtXlDirective,
    BreakpointClassGtXlDirective,
    BreakpointStyleGtXlDirective,
    BreakpointImgSrcGtXlDirective,
    BreakpointFlexGtXlDirective,
    BreakpointOrderGtXlDirective,
    BreakpointOffsetGtXlDirective,
    BreakpointFlexAlignGtXlDirective,
    DmgHeaderComponent
  ],
  exports: [
    BreakpointLayoutXxlDirective,
    BreakpointHideXxlDirective,
    BreakpointShowXxlDirective,
    BreakpointClassXxlDirective,
    BreakpointStyleXxlDirective,
    BreakpointImgSrcXxlDirective,
    BreakpointFlexXxlDirective,
    BreakpointOrderXxlDirective,
    BreakpointOffsetXxlDirective,
    BreakpointFlexAlignXxlDirective,
    BreakpointFillXxlDirective,
    BreakpointLayoutXxsDirective,
    BreakpointHideXxsDirective,
    BreakpointShowXxsDirective,
    BreakpointClassXxsDirective,
    BreakpointStyleXxsDirective,
    BreakpointImgSrcXxsDirective,
    BreakpointFlexXxsDirective,
    BreakpointOrderXxsDirective,
    BreakpointOffsetXxsDirective,
    BreakpointFlexAlignXxsDirective,
    BreakpointFillXxsDirective,
    BreakpointLayoutLtXsDirective,
    BreakpointFillLtXsDirective,
    BreakpointHideLtXsDirective,
    BreakpointShowLtXsDirective,
    BreakpointClassLtXsDirective,
    BreakpointStyleLtXsDirective,
    BreakpointImgSrcLtXsDirective,
    BreakpointFlexLtXsDirective,
    BreakpointOrderLtXsDirective,
    BreakpointOffsetLtXsDirective,
    BreakpointFlexAlignLtXsDirective,
    BreakpointLayoutGtXlDirective,
    BreakpointFillGtXlDirective,
    BreakpointHideGtXlDirective,
    BreakpointShowGtXlDirective,
    BreakpointClassGtXlDirective,
    BreakpointStyleGtXlDirective,
    BreakpointImgSrcGtXlDirective,
    BreakpointFlexGtXlDirective,
    BreakpointOrderGtXlDirective,
    BreakpointOffsetGtXlDirective,
    BreakpointFlexAlignGtXlDirective,
    DmgHeaderComponent
  ],
  providers: [
    CelosNextBreakPointsProvider
  ]
})
export class DmgLayoutModule { }
