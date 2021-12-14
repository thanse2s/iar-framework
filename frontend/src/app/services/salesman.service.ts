import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Salesman} from '../models/salesman';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

import {SALESMAN} from '../models/mock-salesman';
import {MessageService} from './message.service';

/**
 * handles backend communication regarding user accounts
 */

@Injectable({
  providedIn: 'root',
})

export class SalesmanService {

  private SalesmanUrl = `/api/salesman`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /**
   * retrieves userdata of currently authenticated user
   */
  public getSalesmans(): Observable<Salesman[]>{
    return this.http.get<Salesman[]>(this.SalesmanUrl)
      .pipe(
        tap(_ => this.log('no Salesman Found')),
        catchError(this.handleError<Salesman[]>('getHeroes', []))
      );
  }

  getSalesman(id: number): Observable<Salesman>{
    const url = `${this.SalesmanUrl}/${id}`;
    return this.http.get<Salesman>(url).pipe(
      tap(_ => this.log(`No Hero With ID:${id}`)),
        catchError(this.handleError<Salesman>(`get Salesman id=${id}`))
      );
  }

  private log(message: string) {
    this.messageService.add(`SalesmanService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
