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
  private currentSalesman: Salesman;
  private currentUser: User;
  private evaluationRecord: Evaluationrecord[]
  private employeeId: number;
  private bonus: number[];
  private years: string[];

  ngOnInit(): void {
    // this.getUser();
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
        this.getSalesman(user.employee_id);
        this.getEvaluationrecord(user.employee_id)
        this.getBonus();
      });
  }

  getSalesman(id): void {
    this.salesmanService.getSalesman(id)
      .subscribe(salesman => {
        this.currentSalesman = salesman
      });
  }

  getEvaluationrecord(id): void {
    this.evaluationRecordService.getEvaluationRecord(id)
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
