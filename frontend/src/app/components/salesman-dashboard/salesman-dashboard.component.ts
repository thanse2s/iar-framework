import {Component, Input, OnInit} from '@angular/core';
import {SalesmanService} from "../../services/salesman.service";
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

  // private salesmanService: SalesmanService;
  // private userService: UserService
  // private evaluationRecordService: EvaluationrecordService;

  @Input() evaluationRecords: Evaluationrecord[];
  bonus: number[];
  avgBonusPerYears: number[];
  years: string[];

  ngOnInit(): void {
    console.log("Test OnInit");
    this.synchronizedBuild();
  }

  constructor(salesmanService: SalesmanService, userService: UserService, evaluationRecordService: EvaluationrecordService) {
    // this.salesmanService = salesmanService;
    // this.userService = userService;
    // this.evaluationRecordService = evaluationRecordService;
  }

  synchronizedBuild(): void {
    console.log("Test1");
    let bonusAndYear = this.getBonusAndYears(this.evaluationRecords);
    this.bonus = bonusAndYear[0];
    console.log("Test2");
    console.log(this.bonus);
    this.years = bonusAndYear[1];
    console.log("Test3");
    console.log(this.years);
    this.avgBonusPerYears = this.getAveragePerYear(this.bonus);
    console.log("Test4");
    console.log(this.avgBonusPerYears);
  }

  /*
   Helper Function to get totalBonusPerYear and Years of a Record of the Bonus, given the Complete Bonus Salary
  */

  getBonusAndYears(evaluationRecords: Evaluationrecord[]): {bonus:number[],years:number[]} {
    console.log("Test Method");
    console.log(evaluationRecords);
    console.log(evaluationRecords.pop());
    console.log(evaluationRecords);
    let bonus: number[] = [];
    let years: number[] = [];
    console.log("Test Method 2");
    let i: number = 0;
    let totalBonus: number = 0;
    for (i; i < evaluationRecords.length; i++) {
      totalBonus = 0;
      console.log("help");
      console.log(evaluationRecords[i]);
      evaluationRecords[i].orders_evaluation.forEach(orderEvaluation => {
        totalBonus = totalBonus + orderEvaluation.bonus;
        console.log("totalBonus:");
        console.log(totalBonus);
      });
      bonus.push(totalBonus);
      years.push(evaluationRecords[i].year);
    }
    return {bonus,years};
  }


  /*
    Helper Function to calculate Yearly Averages of the Bonus, given the Complete Bonus Salary
   */
  getAveragePerYear(data: number[]): number[] {
    if (data === null) return null;
    let ret: number[] = [];
    let tmp: number[] = [];
    data.forEach(singleData => {
      let sumTilNow: number = tmp.reduce((pv, cv) => pv + cv, 0);
      let avg: number = (singleData + sumTilNow) / (ret.length + 1);
      tmp.push(singleData);
      ret.push(avg);
    });
    return ret;
  }

}
