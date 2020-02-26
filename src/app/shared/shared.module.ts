import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColumnDefDirective } from './directive/column-def.directive';


@NgModule({
  declarations: [ColumnDefDirective],
  imports: [
    CommonModule
  ],
  exports: [ColumnDefDirective]
})
export class SharedModule { }
