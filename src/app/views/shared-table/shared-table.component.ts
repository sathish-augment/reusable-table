import {
  Component,
  Input,
  ChangeDetectionStrategy,
  AfterContentInit,
  QueryList,
  ContentChildren,
  TemplateRef,
  EventEmitter,
  Output,
  ElementRef,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  OnInit
} from "@angular/core";
import { DataSource } from "@angular/cdk/collections";
import { ViewportRuler } from "@angular/cdk/scrolling";
import { Subscription } from "rxjs";
 
import { MatTable } from "@angular/material";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Column } from './../column.type';

@Component({
  selector: 'shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent {

  public MIN_COLUMN_WIDTH:number = 200;

  visibleColumns: Column[];
  hiddenColumns: Column[];
  expandedElement = {}

  // Shared Variables
  @Input() dataSource: DataSource<any>;
  @Input() columnsdef: Column[];
  @ViewChild('dataTable', { static: true })  dataTable: ElementRef;
  private rulerSubscription: Subscription;

  get visibleColumnsIds() {
    const visibleColumnsIds = this.visibleColumns.map(column => column.id)

    return this.hiddenColumns.length ? ['trigger', ...visibleColumnsIds] : visibleColumnsIds
  }

  get hiddenColumnsIds() {
    return this.hiddenColumns.map(column => column.id)
  }

  areCollumnsHidden = () => this.hiddenColumns.length
  isExpansionDetailRow = (row) => row.hasOwnProperty('detailRow');
  isExpansionDetailRow2 = (row) => !row.hasOwnProperty('detailRow');

  constructor(private ruler: ViewportRuler, private _changeDetectorRef: ChangeDetectorRef, private zone: NgZone) {
    this.rulerSubscription = this.ruler.change(500).subscribe(data => {
      // accesing clientWidth cause browser layout, cache it!
      // const tableWidth = this.table.nativeElement.clientWidth;
      this.toggleColumns(this.dataTable['_elementRef'].nativeElement.clientWidth); 
    });
  }

  /**
   * Lifecycle Hook Start
   */
  ngAfterContentInit() {
     this.toggleColumns(this.dataTable['_elementRef'].nativeElement.clientWidth);
  }

  ngOnDestroy() {
    this.rulerSubscription.unsubscribe();
  }

  /**
   * Lifecycle Hook End
   */
  
  toggleColumns(tableWidth: number){
    this.zone.runOutsideAngular(() => {
      const sortedColumns = this.columnsdef.slice()
        .map((column, index) => ({ ...column, order: index }))
        .sort((a, b) => a.hideOrder - b.hideOrder);

      for (const column of sortedColumns) {
        const columnWidth = column.width ? column.width : this.MIN_COLUMN_WIDTH;

        if (column.hideOrder && tableWidth < columnWidth) {
          column.visible = false;

          continue;
        }

        tableWidth -= columnWidth;
        column.visible = true;
      }

      this.columnsdef = sortedColumns.sort((a, b) => a.order - b.order);
      this.visibleColumns = this.columnsdef.filter(column => column.visible);
      this.hiddenColumns = this.columnsdef.filter(column => !column.visible)
    })

    this._changeDetectorRef.detectChanges();
  }

 

}
