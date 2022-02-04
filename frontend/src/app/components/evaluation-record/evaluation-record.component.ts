import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { EvaluationrecordService } from '../../services/evaluationrecord.service';
import { Evaluationrecord } from '../../models/Evaluationrecord';
import { BonusSalaryService } from '../../services/bonussalary.service';
import { BonusSalary } from '../../models/BonusSalary';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-evaluation-record',
  templateUrl: './evaluation-record.component.html',
  styleUrls: ['./evaluation-record.component.css']})

export class EvaluationRecordComponent implements OnInit {

  @Input() paramEmployeeID: number;
  evalService: EvaluationrecordService;
  bonusSalaryService: BonusSalaryService;

  editMode: boolean;
  evaluationRecord: Evaluationrecord[] = [];
  bonusSalaries: BonusSalary[] = [];
  relation: Fields[] = [];
  recordRelation: AllFields[] = [];

  constructor(evalService: EvaluationrecordService,
              bonusSalaryService: BonusSalaryService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
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
          this.createFormFields(record);
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
  createFormFields(record: Evaluationrecord): void {
    this.recordRelation.push(new AllFields(
      this.fb.array([]),
      this.fb.group({
        skill: [null, Validators.required],
        target: [5, [Validators.required, Validators.min(0), Validators.max(10)]],
        actual: [5, [Validators.required, Validators.min(0), Validators.max(10)]],
        bonus: [null, [Validators.min(0), Validators.max(100000000)]],
        comment: null
      }), record));
    record.orders_evaluation.forEach(order => {
      this.createBonusAndCommentField(order, record);
    });
    record.social_performance.forEach(social => {
      this.createBonusAndCommentField(social, record);
    });
  }
  createBonusAndCommentField(socialOrOrder, record): void {
    const newFormGroup = this.fb.group({
      bonus: [{value: socialOrOrder.bonus, disabled: !this.editMode}, [Validators.required, Validators.min(0), Validators.max(100000000)]],
      comment: [{value: socialOrOrder.comment, disabled: !this.editMode}]
    });
    this.relation.push(new Fields(newFormGroup, socialOrOrder));
    this.findFieldsInRecordRelation(record).fields.push(newFormGroup);
  }
  findFieldsInRelation(content): Fields {
    return this.relation.find(el => el.content === content) as Fields;
  }
  findFieldsInRecordRelation(record: Evaluationrecord): AllFields {
    return this.recordRelation.find(el => el.content === record) as AllFields;
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


class Fields {
  fields: FormGroup;
  content: any;
  constructor(fields: FormGroup, content) {
    this.fields = fields;
    this.content = content;
  }
}
class AllFields {
  fields: FormArray;
  addSocial: FormGroup;
  content: Evaluationrecord;
  constructor(fields: FormArray, addSocial: FormGroup, content: Evaluationrecord) {
    this.fields = fields;
    this.addSocial = addSocial;
    this.content = content;
  }
}
