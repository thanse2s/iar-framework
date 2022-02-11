import { Component, OnInit} from '@angular/core';
import {Salesman} from "../../models/Salesman";
import {SalesmanService} from "../../services/salesman.service";
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";
import {EvaluationrecordService} from "../../services/evaluationrecord.service";
import {Evaluationrecord} from "../../models/Evaluationrecord";
import {Orderevaluation} from "../../models/Orderevaluation";


@Component({
  selector: 'salesman-dashboard',
  templateUrl: './salesman-dashboard.component.html',
  styleUrls: ['./salesman-dashboard.component.css']
})
export class SalesmanDashboardComponent implements OnInit {

  private salesmanService: SalesmanService;
  private userService: UserService
  private evaluationRecordService: EvaluationrecordService;
  public currentSalesman: Salesman;
  public currentUser: User;
  public evaluationRecord: Evaluationrecord[]
  public employeeId: number;
  public bonus: number[];
  public years: string[];

  ngOnInit(): void {
    this.getUser();
    console.log(this.currentUser);
    this.getSalesman();
    console.log(this.currentSalesman);
    this.getEvaluationrecord();
    console.log(this.evaluationRecord);
    this.getBonus();
    console.log(this.bonus);
  }

  constructor(salesmanService: SalesmanService, userService: UserService, evaluationRecordService: EvaluationrecordService) {
    this.salesmanService = salesmanService;
    this.userService = userService;
    this.evaluationRecordService = evaluationRecordService;
  }

  getUser(): void {
    this.userService.getOwnUser()
      .subscribe(user => {
        this.currentUser = user;
        this.employeeId = user.employee_id;
        console.log(this.currentUser);
        console.log(this.employeeId);
      });
  }

  getSalesman(): void {
    this.salesmanService.getSalesman(this.employeeId)
      .subscribe(salesman => {
        this.currentSalesman = salesman
      });
  }

  getEvaluationrecord(): void {
    this.evaluationRecordService.getEvaluationRecord(this.employeeId)
      .subscribe(evaluationrecord => this.evaluationRecord = evaluationrecord);
  }

  getBonus(): void {
    this.evaluationRecord.forEach(evaluationRecord => {
      evaluationRecord.orders_evaluation.forEach(orderEvaluation => {
        this.bonus.push(orderEvaluation.bonus);
      });
    });
  }

}
