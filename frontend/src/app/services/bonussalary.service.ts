import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {BonusSalary} from '../models/BonusSalary';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

import {MessageService} from './message.service';
import {error} from 'protractor';

@Injectable({
  providedIn: 'root',
})

export class BonusSalaryService {

  private bonusSalaryURL = `/api/bonussalary`;

  constructor(private https: HttpClient, private messageService: MessageService) {  }

  public getBonusSalary(id: number): Observable<BonusSalary[]> {
    const url = `${this.bonusSalaryURL}/${id}`;
    return this.https.get<BonusSalary[]>(url).pipe(
      catchError(this.handleError<BonusSalary[]>(`get BonusSalary id: ${id}`))
    );
  }

  private log(message: string): void {
    this.messageService.add(`BonusSalaryService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T): any {
    // tslint:disable-next-line:no-shadowed-variable
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

