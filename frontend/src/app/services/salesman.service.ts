import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Salesman} from '../models/Salesman';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

import {MessageService} from './message.service';
import {User} from '../models/User';

/**
 * handles backend communication regarding user accounts
 */

@Injectable({
  providedIn: 'root',
})

export class SalesmanService {

  private SalesmanUrl = `/api/salesman`;

  constructor(private https: HttpClient, private messageService: MessageService) { }

  /**
   * retrieves userdata of currently authenticated user
   */
  public getSalesmans(): Observable<Salesman[]>{
    return this.https.get<Salesman[]>(this.SalesmanUrl,)
      .pipe(
        tap(_ => this.log('no Salesman Found')),
        catchError(this.handleError<Salesman[]>('getHeroes', []))
      );
  }

  getSalesman(id: number): Observable<Salesman>{
    const url = `${this.SalesmanUrl}/${id}`;
    return this.https.get<Salesman>(url).pipe(
        tap(_ => this.log(`No Hero With ID:${id}`)),
        catchError(this.handleError<Salesman>(`get Salesman id=${id}`))
      );
  }

  testgetSalesman(id: number): Observable<Salesman>{
    return this.https.get<Salesman>('/api/user');
  }


  private log(message: string): void {
    this.messageService.add(`SalesmanService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T): any {
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
