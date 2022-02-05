import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { EvaluationrecordService } from '../../services/evaluationrecord.service';
import { Evaluationrecord } from '../../models/Evaluationrecord';
import { BonusSalaryService } from '../../services/bonussalary.service';
import { BonusSalary } from '../../models/BonusSalary';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {SingleEvalRecordComponent} from '../single-eval-record/single-eval-record.component';

@Component({
  selector: 'app-evaluation-record',
  templateUrl: './evaluation-record.component.html',
  styleUrls: ['./evaluation-record.component.css']})

export class EvaluationRecordComponent implements OnInit {

  @Input() paramEmployeeID: number;
  evalService: EvaluationrecordService;
  bonusSalaryService: BonusSalaryService;

  editMode: boolean;
  evaluationRecords: Evaluationrecord[] = [];
  bonusSalaries: BonusSalary[] = [];

  constructor(evalService: EvaluationrecordService,
              bonusSalaryService: BonusSalaryService,
              protected messageService: MessageService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) {
    this.evalService = evalService;
    this.bonusSalaryService = bonusSalaryService;
    this.editMode = false;
  }

  getEvaluationRecord(): void {
    this.evalService.getEvaluationRecord(this.paramEmployeeID)
      .subscribe(records => {
        records.forEach(record => {
          this.addRecord(record);
          this.getBonusSalary(record.employee_id);
        });
      });
  }
  addRecord(evalRecord: Evaluationrecord): void {
    this.evaluationRecords.splice(this.findLoc(evalRecord, this.evaluationRecords) + 1, 0, evalRecord);
  }
  findLoc(el: Evaluationrecord, arr: Evaluationrecord[]): number {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].year > el.year
        && arr[i].employee_id === el.employee_id) {
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
  getEditMode(): string {
    return this.editMode ? 'editing' : 'hide';
  }

  ngOnInit(): void {
    this.getEvaluationRecord();
  }
}
