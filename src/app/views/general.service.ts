import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map} from 'rxjs/operators';

import { Column } from './column.type';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private serviceUrl = 'https://jsonplaceholder.typicode.com/users';


  constructor(private http:HttpClient) { }

  //Get users
  // getUser(): Observable<Column[]> {
  //   return this.http.get<Column[]>(this.serviceUrl);
  // }

  getUsers(): Observable<Column[]> {
    return this.http.get<Column[]>(this.serviceUrl).pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
 
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

        errorMessage = `An error occurred: ${err.error.message}`;
    } else {

        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
}


}
