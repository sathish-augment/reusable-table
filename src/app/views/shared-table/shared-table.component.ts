import { Component, Input, ChangeDetectionStrategy, AfterContentInit, QueryList, ContentChildren, TemplateRef,
  EventEmitter, Output, ElementRef, OnDestroy, ViewChild, ChangeDetectorRef, NgZone } from "@angular/core";
import { DataSource } from "@angular/cdk/collections";
import { ViewportRuler } from "@angular/cdk/scrolling";
import { Subscription } from "rxjs";
import { MatTableDataSource, MatTable } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Column } from './../column.type';
import { ColumnDefDirective } from './../../shared/directive/column-def.directive';

@Component({
  selector: 'shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SharedTableComponent implements AfterContentInit, OnDestroy  {

  public MIN_COLUMN_WIDTH:number = 200;

  visibleColumns: Column[];
  hiddenColumns: Column[];
  expandedElement = {}

  // Shared Variables
  @Input() dataSource: DataSource<any>;
  @Input() columnsdef: Column[];
  @ViewChild('dataTable', { static: true })  dataTable: MatTable<Element>;

  @ContentChildren(ColumnDefDirective)
  _templates: QueryList<ColumnDefDirective>;

  private rulerSubscription: Subscription;

  private _templateMap: Map<string, TemplateRef<any>> = new Map<
    string,
    TemplateRef<any>
  >();
  

  get visibleColumnsIds() {
    const visibleColumnsIds = this.visibleColumns.map(column => column.id)

    return this.hiddenColumns.length ? ['trigger', ...visibleColumnsIds] : visibleColumnsIds
  }

  get hiddenColumnsIds() {
    return this.hiddenColumns.map(column => column.id)
  }

  //isExpansionDetailRow = (row) => row.hasOwnProperty('detailRow');
  isExpansionDetailRow = (index, item) =>{
    console.log(index,item)
    let res = item.hasOwnProperty('detailRow');
    return res;
  }


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
     for (let i: number = 0; i < this._templates.toArray().length; i++) {
      this._templateMap.set(
        this._templates.toArray()[i].qtColumnDef,
        this._templates.toArray()[i].templateRef
      );
    }

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

  getTemplateRef(name: string): TemplateRef<any> {
    return this._templateMap.get(name);
  } 

}
