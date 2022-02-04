import { Component } from '@angular/core';
import {EvaluationRecordComponent} from '../evaluation-record/evaluation-record.component';
import {EvaluationrecordService} from '../../services/evaluationrecord.service';
import {BonusSalaryService} from '../../services/bonussalary.service';
import {MessageService} from '../../services/message.service';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {Evaluationrecord} from '../../models/Evaluationrecord';

@Component({
  selector: 'app-hr-eval-record',
  templateUrl: './hr-eval-record.component.html',
  styleUrls: ['./hr-eval-record.component.css',
              '../evaluation-record/evaluation-record.component.css']
})
export class HrEvaluationRecordComponent extends EvaluationRecordComponent{

  open: number;

  constructor(evalService: EvaluationrecordService,
              bonusSalaryService: BonusSalaryService,
              messageService: MessageService,
              route: ActivatedRoute,
              fb: FormBuilder) {
    super(evalService, bonusSalaryService, messageService, route, fb);
    this.open = 0;
  }

  getEvaluationRecord(): void {
    this.evalService.getUncommittedEvaluationRecords()
      .subscribe(records => {
        records.forEach(record => {
          this.addRecord(record);
          this.getBonusSalary(record.employee_id);
          this.createFormFields(record);
        });
      });
  }
  commitBonus(record: Evaluationrecord): void {
    this.open++;
    record.is_committed = true;
    this.evalService.commitBonus(record.employee_id, record.year, this.calculateTotalBonusSalary(record)).subscribe();
  }

}
