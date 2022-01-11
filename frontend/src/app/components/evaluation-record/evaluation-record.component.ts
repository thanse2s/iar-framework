import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {EvaluationrecordService} from '../../services/evaluationrecord.service';
import {Evaluationrecord} from '../../models/Evaluationrecord';
import {BonusSalaryService} from '../../services/bonussalary.service';
import {BonusSalary} from '../../models/BonusSalary';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-evaluation-record',
  templateUrl: './evaluation-record.component.html',
  styleUrls: ['./evaluation-record.component.css'],
})

export class EvaluationrecordComponent implements OnInit {

  private evalService: EvaluationrecordService;
  private bonusSalaryService: BonusSalaryService;
  private id: number;
  editMode: boolean;
  editingRecord: Evaluationrecord;
  evaluationRecord: Evaluationrecord[] = [];
  bonusSalaries: BonusSalary[] = [];
  relation: Fields[] = [];
  recordRelation: AllFields[] = [];

  @Input() para_employee_id?: number;


  constructor(evalService: EvaluationrecordService,
              bonusSalaryService: BonusSalaryService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
    this.evalService = evalService;
    this.bonusSalaryService = bonusSalaryService;
    this.editMode = false;
    //this.route.params.subscribe(params => this.id = parseInt(params.id, 10));
    this.id = this.para_employee_id;
  }

  getEvaluationRecord(): void {
    this.evalService.getEvaluationRecord(this.id)
      .subscribe(records => {
        records.forEach(evalrecord => {
          this.addRecord(evalrecord);
          this.getBonusSalary(evalrecord.employee_id);
          this.createFormFields(evalrecord);
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
      comment: [{value: socialOrOrder.comment, disabled: !this.editMode}, Validators.required]
    });
    this.relation.push(new Fields(newFormGroup, socialOrOrder));
    if (this.findFieldsInRecordRelation(record) === undefined) {
      this.recordRelation.push(new AllFields(this.fb.array([newFormGroup]), record));
    } else {
      this.findFieldsInRecordRelation(record).fields.push(newFormGroup);
    }
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
  switchEditMode(editRecord: Evaluationrecord): void {
    if (!this.editMode) {
      this.editingRecord = editRecord;
      this.findFieldsInRecordRelation(this.editingRecord).fields.enable();
      this.editMode = !this.editMode;
    } else {
      if (this.findFieldsInRecordRelation(this.editingRecord).fields.touched) {
        this.editingRecord.orders_evaluation.forEach(order => {
          order.bonus = this.findFieldsInRelation(order).fields.value.bonus;
          order.comment = this.findFieldsInRelation(order).fields.value.comment;
        });
        this.editingRecord.social_performance.forEach(social => {
          social.bonus = this.findFieldsInRelation(social).fields.value.bonus;
          social.comment = this.findFieldsInRelation(social).fields.value.comment;
        });
        this.evalService.updateEvaluationRecord(this.editingRecord).subscribe();
      }
      this.findFieldsInRecordRelation(this.editingRecord).fields.disable();
      this.editMode = !this.editMode;
    }
  }

  ngOnInit(): void {
    this.id = this.para_employee_id;
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
  content: Evaluationrecord;
  constructor(fields: FormArray, content: Evaluationrecord) {
    this.fields = fields;
    this.content = content;
  }
}
