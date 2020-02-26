import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';


// Interfaces
import { Column } from './../column.type';
// Services
import { GeneralService } from './../general.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {

  public dataSource = new UserDataSource(this.service);

  columns:Column[]=[
    {id:'id',label:'S. No.',hideOrder:0,width:60},
    {id:'name',label:'Name',hideOrder:1},
    {id:'username',label:'Username',hideOrder:3},
    {id:'email',label:'Email',hideOrder:4},
    {id:'phone',label:'Phone No.',hideOrder:5},
    {id:'website',label:'Website',hideOrder:6}
  ]

  constructor(private service:GeneralService) { }
 
}

//My Custom Data Source
class UserDataSource extends DataSource<Column>{

  constructor(private userService: GeneralService) {
    super();
  }
   
  connect():Observable<Column[]>{
    return this.userService.getUser();
  }

  disconnect(){}

}
