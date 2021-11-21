import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Salesman} from "../models/salesman";
import {HttpClient} from "@angular/common/http";

/**
 * handles backend communication regarding user accounts
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * retrieves userdata of currently authenticated user
   */
  getOwnUser():Observable<Salesman>{
    return this.http.get<Salesman>('/api/salesman'); //use angular's integrated HTTP-client to make a get request; handle the response as a User object
  }
}
