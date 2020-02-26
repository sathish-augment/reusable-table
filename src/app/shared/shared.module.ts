import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from './material.module';

// Components
import { SharedTableComponent } from './../views/shared-table/shared-table.component';

// Directives
import { ColumnDefDirective } from './directive/column-def.directive';


@NgModule({
  declarations: [ColumnDefDirective, SharedTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [ColumnDefDirective, SharedTableComponent]
})
export class SharedModule { }
