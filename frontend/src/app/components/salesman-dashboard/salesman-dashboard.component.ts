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

  avgSocialPerformancePerYear: number[];

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
    this.avgBonusPerYears = this.getAverageBonusPerYear(this.bonus);
    this.avgSocialPerformancePerYear = this.getAverageSocialPerformancePerYear(this.evaluationRecords);
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
  getAverageBonusPerYear(bonus: number[]): number[] {
    if (bonus === null || bonus === undefined) {
      return null;
    }
    const ret: number[] = [];
    const tmp: number[] = [];
    bonus.forEach(singleData => {
      const sumTilNow: number = tmp.reduce((pv, cv) => pv + cv, 0);
      const avg: number = (singleData + sumTilNow) / (ret.length + 1);
      tmp.push(singleData);
      ret.push(avg);
    });
    return ret;
  }

  /*
  Helper Function to calculcate Yearly Averages of the Social Performance
   */

  getAverageSocialPerformancePerYear(evaluationRecord: Evaluationrecord[]): number[] {
    if (evaluationRecord === null || undefined) {
      return null;
    }
    const averages: number[] = [];
    for(const record of evaluationRecord) {
      let valueSum = 0;
      record.social_performance.forEach(socialPerformance => {
        valueSum += socialPerformance.actual_value;
      });
      averages.push(valueSum/record.social_performance.length);
    }
    return averages;
  }

}
