import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {Evaluationrecord} from '../models/Evaluationrecord';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

import {MessageService} from './message.service';
import {error} from 'protractor';

@Injectable({
  providedIn: 'root',
})

export class EvaluationrecordService {

  private EvalrecURL = `/api/performance`;

  constructor(private https: HttpClient, private messageService: MessageService) {  }

  public getEvaluationrecord(id: number): Observable<Evaluationrecord[]> {
    const url = `${this.EvalrecURL}/${id}`;
    return this.https.get<Evaluationrecord[]>(url).pipe(
      tap(_ => console.log(`No EvaluationRecord with id: ${id}`)),
      catchError(this.handleError<Evaluationrecord[]>(`get EvaluationRecord id: ${id}`))
    );
  }
  public updateEvaluationRecord(record: Evaluationrecord): Observable<HttpResponse<any>> {
    console.log(`${this.EvalrecURL}/${record.employee_id}?year=${record.year}`);
    return this.https.post(
      `${this.EvalrecURL}/${record.employee_id}?year=${record.year}`,
      {orders_evaluation: record.orders_evaluation, social_performance: record.social_performance}).pipe(
        tap(_ => this.log(`Updating Record of Employee with ID: ${record.employee_id}`)),
        catchError(this.handleError('update EvaluationRecord'))
    );
  }

  private log(message: string): void {
    this.messageService.add(`SalesmanService: ${message}`);
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

