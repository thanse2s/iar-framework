import { Component, OnInit} from '@angular/core';
import {Salesman} from "../../models/Salesman";
import {SalesmanService} from "../../services/salesman.service";
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";
import {EvaluationrecordService} from "../../services/evaluationrecord.service";
import {Evaluationrecord} from "../../models/Evaluationrecord";
import {Orderevaluation} from "../../models/Orderevaluation";
import {SalesmanDashboardService} from "../../services/salesman-dashboard.service";


@Component({
  selector: 'salesman-dashboard',
  templateUrl: './salesman-dashboard.component.html',
  styleUrls: ['./salesman-dashboard.component.css']
})
export class SalesmanDashboardComponent implements OnInit {

  private salesmanService: SalesmanService;
  private userService: UserService
  private evaluationRecordService: EvaluationrecordService;
  private salesmanDashboardService;
  private currentSalesman: Salesman;
  private currentUser: User;
  private evaluationRecord: Evaluationrecord[]
  private employeeId: number;
  public bonus: number[];
  public years: string[];

  ngOnInit(): void {
    this.getUser();
    this.getSalesman();
    this.getEvaluationrecord();
    this.getBonus();
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
        console.log(this.employeeId);
      });
  }

  getSalesman(): void {
    this.salesmanService.getSalesman(this.employeeId)
      .subscribe(salesman => this.currentSalesman = salesman);
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
