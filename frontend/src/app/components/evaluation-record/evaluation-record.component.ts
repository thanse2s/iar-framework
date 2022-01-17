import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { EvaluationrecordService } from '../../services/evaluationrecord.service';
import { Evaluationrecord } from '../../models/Evaluationrecord';
import { Socialperformance } from '../../models/Socialperformance';
import { BonusSalaryService } from '../../services/bonussalary.service';
import { BonusSalary } from '../../models/BonusSalary';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-evaluation-record',
  templateUrl: './evaluation-record.component.html',
  styleUrls: ['./evaluation-record.component.css'],
  animations: [
    trigger('hideButtons', [
      state('editing', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('editing => hide', [
        query('mat-form-field', animate('300ms ease-out', style({
          opacity: 0
        }))),
        query('button', animate('400ms ease-out', style({
          transform: 'translateX(500%)'
        })))
      ]),
      transition('hide => editing', [
        style({opacity: 1}),
        query('button', style({
          transform: 'translateX(500%)'
        })),
        query('mat-form-field', style({
          opacity: 0
        })),
        query('button',
          stagger('100ms', [
            animate('200ms', style({
              transform: 'translateX(0%)'
            }))
          ])),
        query('mat-form-field',
          stagger('50ms', [
            animate('300ms ease-out', style({
              opacity: 1
            }))
          ]))
      ])
    ])
  ]
})

export class EvaluationRecordComponent implements OnInit {

  @Input() paramEmployeeID: number;
  private evalService: EvaluationrecordService;
  private bonusSalaryService: BonusSalaryService;

  editMode: boolean;
  editingRecord: Evaluationrecord;
  addedSocialPerformances: Socialperformance[] = [];

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
  addSocialPerformance(record: Evaluationrecord): void {
    const form = this.findFieldsInRecordRelation(record).addSocial;
    if (!form.invalid) {
      const newSocialPerformance = new Socialperformance(
        form.value.actual,
        form.value.target,
        form.value.skill,
        form.value.bonus,
        form.value.comment
      );
      record.social_performance.push(newSocialPerformance);
      this.addedSocialPerformances.push(newSocialPerformance);
      this.createBonusAndCommentField(newSocialPerformance, record);
      form.patchValue({skill: null, target: 5, actual: 5, bonus: null, comment: null});
    }
  }
  enterEditMode(editRecord: Evaluationrecord): void {
    if (!this.editMode) {
      this.editingRecord = editRecord;
      this.findFieldsInRecordRelation(this.editingRecord).fields.enable();
      this.editMode = !this.editMode;
    }
  }
  saveChanges(): void {
    if (this.editMode) {
      const fields = this.findFieldsInRecordRelation(this.editingRecord).fields;
      if (!fields.invalid) {
        // some fields were changed but no new social performance was added
        const touched = fields.touched;
        if (touched) {
          this.editingRecord.orders_evaluation.forEach(order => {
            order.bonus = this.findFieldsInRelation(order).fields.value.bonus;
            order.comment = this.findFieldsInRelation(order).fields.value.comment;
          });
          this.editingRecord.social_performance.forEach(social => {
            social.bonus = this.findFieldsInRelation(social).fields.value.bonus;
            social.comment = this.findFieldsInRelation(social).fields.value.comment;
          });
        }
        // Any changes occurred that need to be updated
        if (touched || this.addedSocialPerformances.length > 0) {
          this.evalService.updateEvaluationRecord(this.editingRecord).subscribe();
          this.addedSocialPerformances = [];
        }
        fields.disable();
        this.editMode = !this.editMode;
      }
    }
  }
  undoChanges(): void {
    if (this.editMode) {
      // reset social performances
      if (this.addedSocialPerformances.length > 0) {
        this.addedSocialPerformances.forEach(_ => {
          this.editingRecord.social_performance.pop();
          this.relation.pop();
        });
      }
      // reset all fields if any was touched
      if (this.findFieldsInRecordRelation(this.editingRecord).fields.touched) {
        this.editingRecord.orders_evaluation.forEach(order => {
          this.findFieldsInRelation(order).fields.patchValue({
            bonus: order.bonus,
            comment: order.comment
          });
        });
        this.editingRecord.social_performance.forEach(social => {
          this.findFieldsInRelation(social).fields.patchValue({
            bonus: social.bonus,
            comment: social.comment
          });
        });
      }
      // leave edit-mode
      this.findFieldsInRecordRelation(this.editingRecord).fields.disable();
      this.editMode = !this.editMode;
    }
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
