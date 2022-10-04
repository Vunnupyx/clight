import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { LayoutModule as MatLayoutModule } from '@angular/cdk/layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedServicesModule } from './services/shared-services.module';
import { StateModule } from './state/state.module';
import { AppTranslationModule } from 'app/app.translation';
import { DocBtnComponent } from './components/doc-btn/doc-btn.component';
import { MdcIconModule } from './mdc-icon/mdc-icon.module';

@NgModule({
  declarations: [DocBtnComponent],
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  providers: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatLayoutModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    NgxDatatableModule,
    NgxMatSelectSearchModule,
    DragDropModule,
    AppTranslationModule,
    SharedServicesModule,
    StateModule,
    MdcIconModule,
    DocBtnComponent,
  ]
})
export class SharedModule {}
