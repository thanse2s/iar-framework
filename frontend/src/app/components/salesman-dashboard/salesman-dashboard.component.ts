import {Component, Input, AfterContentChecked} from '@angular/core';
import {Evaluationrecord} from '../../models/Evaluationrecord';


@Component({
  selector: 'app-salesman-dashboard',
  templateUrl: './salesman-dashboard.component.html',
  styleUrls: ['./salesman-dashboard.component.css']
})
export class SalesmanDashboardComponent implements AfterContentChecked {

  @Input() evaluationRecords: Evaluationrecord[];
  bonus: number[];
  avgBonusPerYears: number[];
  years: string[];

  ngAfterContentChecked(): void {
    this.synchronizedBuild();
  }

  constructor() {
    this.avgBonusPerYears = [];
  }

  synchronizedBuild(): void {
    const bonusAndYear = this.getBonusAndYears(this.evaluationRecords);
    this.bonus = bonusAndYear.bonus;
    this.years = bonusAndYear.years;
    this.avgBonusPerYears = this.getAveragePerYear(this.bonus);
  }

  /*
   Helper Function to get totalBonusPerYear and Years of a Record of the Bonus, given the Complete Bonus Salary
  */

  getBonusAndYears(evaluationRecords: Evaluationrecord[]): {bonus: number[], years: string[]} {
    const bonus: number[] = [];
    const years: string[] = [];
    let totalBonus = 0;
    for (const record of evaluationRecords) {
      totalBonus = 0;
      record.orders_evaluation.forEach(orderEvaluation => {
        totalBonus = totalBonus + orderEvaluation.bonus;
      });
      bonus.push(totalBonus);
      years.push(record.year.toString());
    }
    return {bonus, years};
  }


  /*
    Helper Function to calculate Yearly Averages of the Bonus, given the Complete Bonus Salary
   */
  getAveragePerYear(data: number[]): number[] {
    if (data === null || data === undefined) {
      return null;
    }
    const ret: number[] = [];
    const tmp: number[] = [];
    data.forEach(singleData => {
      const sumTilNow: number = tmp.reduce((pv, cv) => pv + cv, 0);
      const avg: number = (singleData + sumTilNow) / (ret.length + 1);
      tmp.push(singleData);
      ret.push(avg);
    });
    return ret;
  }

}
