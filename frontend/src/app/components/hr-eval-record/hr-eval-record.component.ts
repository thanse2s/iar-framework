import { Component } from '@angular/core';
import {EvaluationrecordService} from '../../services/evaluationrecord.service';
import {BonusSalaryService} from '../../services/bonussalary.service';
import {FormBuilder} from '@angular/forms';
import {SingleEvalRecordComponent} from '../single-eval-record/single-eval-record.component';

@Component({
  selector: 'app-hr-evaluation-record',
  templateUrl: './hr-eval-record.component.html',
  styleUrls: ['./hr-eval-record.component.css',
              '../evaluation-record/evaluation-record.component.css']
})
export class HrEvaluationRecordComponent extends SingleEvalRecordComponent{

  open: number;

  constructor(fb: FormBuilder,
              bonusSalaryService: BonusSalaryService,
              private evalService: EvaluationrecordService) {
    super(fb, bonusSalaryService);
    this.open = 0;
  }

  commitBonus(): void {
    this.open++;
    this.evaluationRecord.is_committed = true;
    // this.evalService.commitBonus(
    //   this.evaluationRecord.employee_id,
    //   this.evaluationRecord.year,
    //   this.calculateTotalBonusSalary(this.evaluationRecord)).subscribe();
  }

}
