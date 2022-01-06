import { Component, OnInit } from '@angular/core';
import {Evaluationrecord} from '../../models/Evaluationrecord';
import {EvaluationrecordService} from '../../services/evaluationrecord.service';
import {BonusSalaryService} from '../../services/bonussalary.service';
import {BonusSalary} from '../../models/BonusSalary';

@Component({
  selector: 'app-commit-page',
  templateUrl: './commit-page.component.html',
  styleUrls: ['./commit-page.component.css']
})
export class CommitPageComponent implements OnInit {

  private evalService: EvaluationrecordService;
  private bonusSalaryService: BonusSalaryService;
  evaluationRecord: Evaluationrecord[] = [];
  bonusSalaries: BonusSalary[] = [];
  open = 0;

  constructor(evalService: EvaluationrecordService,
              bonusSalaryService: BonusSalaryService) {
    this.evalService = evalService;
    this.bonusSalaryService = bonusSalaryService;
  }

  getEvaluationRecord(): void {
    this.evalService.getUncommittedEvaluationRecords()
      .subscribe(records => {
        records.forEach(evalrecord => {
          this.addRecord(evalrecord);
          this.getBonusSalary(evalrecord.employee_id);
        });
      });
  }
  addRecord(el: Evaluationrecord): void {
    this.evaluationRecord.splice(this.findLoc(el, this.evaluationRecord) + 1, 0, el);
  }
  findLoc(el: Evaluationrecord, arr: Evaluationrecord[]): number {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].year > el.year && arr[i].employee_id === el.employee_id) {
        return i - 1;
      }
    }
    return arr.length;
  }
  getBonusSalary(id: number): void {
    if (!this.bonusSalaries.find(salary => salary.employee_id = id)) {
      this.bonusSalaryService.getBonusSalary(id)
        .subscribe(salaries => {
          salaries.forEach(salary => {
            this.bonusSalaries.push(salary);
          });
        });
    }
  }
  findBonusSalaryByIDAndYear(id: number, year: number): number {
    const salary = this.bonusSalaries.find(el => (el.employee_id === id) && (el.year === year));
    return salary !== undefined ? salary.value : 0;
  }
  calculateTotalBonusSalary(record: Evaluationrecord): number {
    let bonusSalary = 0;
    record.orders_evaluation.forEach(order => {
      bonusSalary += order.bonus;
    });
    record.social_performance.forEach(social => {
      bonusSalary += social.bonus;
    });
    return bonusSalary;
  }
  commitBonus(record: Evaluationrecord): void {
    this.open++;
    record.is_committed = true;
    this.evalService.commitBonus(record.employee_id, record.year, this.calculateTotalBonusSalary(record)).subscribe();
  }

  ngOnInit(): void {
    this.getEvaluationRecord();
  }

}
