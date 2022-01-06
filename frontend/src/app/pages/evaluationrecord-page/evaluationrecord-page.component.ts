import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {EvaluationrecordService} from '../../services/evaluationrecord.service';
import {Evaluationrecord} from '../../models/Evaluationrecord';
import {BonusSalaryService} from '../../services/bonussalary.service';
import {BonusSalary} from '../../models/BonusSalary';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-evaluationrecord-page',
  templateUrl: './evaluationrecord-page.component.html',
  styleUrls: ['./evaluationrecord-page.component.css'],
})

export class EvaluationrecordPageComponent implements OnInit {

  private evalService: EvaluationrecordService;
  private bonusSalaryService: BonusSalaryService;
  private id: number;
  editMode: boolean;
  editingRecord: number;
  evaluationRecord: Evaluationrecord[] = [];
  bonusSalaries: BonusSalary[] = [];
  bonusForm: FormGroup;

  constructor(evalService: EvaluationrecordService,
              bonusSalaryService: BonusSalaryService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
    this.evalService = evalService;
    this.bonusSalaryService = bonusSalaryService;
    this.editMode = false;
    this.route.params.subscribe(params => this.id = parseInt(params.id));
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
    const orderFormArray: FormArray = this.fb.array([], Validators.required);
    const socialFormArray: FormArray = this.fb.array([], Validators.required);
    record.orders_evaluation.forEach(order => {
      orderFormArray.push(this.createBonusAndCommentField(order.bonus, order.comment));
    });
    record.social_performance.forEach(social => {
      socialFormArray.push(this.createBonusAndCommentField(social.bonus, social.comment));
    });
    (this.bonusForm.get('formsOfRecords') as FormArray).push(this.fb.group({
      orderForm: orderFormArray,
      socialForm: socialFormArray
    }));
  }
  createBonusAndCommentField(bonus: number, comment: string): FormGroup {
    return this.fb.group({
      bonus: [{value: bonus, disabled: !this.editMode}, [Validators.required, Validators.min(0), Validators.max(100000000)]],
      comment: [{value: comment, disabled: !this.editMode}, Validators.required]
    });
  }
  findOrderFieldsInBonusForm(i: number, j: number): FormGroup {
    return this.bonusForm.get(`formsOfRecords.${i}.orderForm.${j}`) as FormGroup;
  }
  findSocialFieldsInBonusForm(i: number, j: number): FormGroup {
    return this.bonusForm.get(`formsOfRecords.${i}.socialForm.${j}`) as FormGroup;
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
  switchEditMode(editRecord: number): void {
    if (!this.editMode) {
      this.editingRecord = editRecord;
      this.bonusForm.enable();
      this.editMode = !this.editMode;
    } else {
      if (this.bonusForm.get(`formsOfRecords.${this.editingRecord}`).touched) {
        const record = this.evaluationRecord[this.editingRecord];
        for (let j = 0; j < this.evaluationRecord[this.editingRecord].orders_evaluation.length; j++) {
          record.orders_evaluation[j].bonus = this.findOrderFieldsInBonusForm(this.editingRecord, j).value.bonus;
          record.orders_evaluation[j].comment = this.findOrderFieldsInBonusForm(this.editingRecord, j).value.comment;
        }
        for (let j = 0; j < this.evaluationRecord[this.editingRecord].social_performance.length; j++) {
          record.social_performance[j].bonus = this.findSocialFieldsInBonusForm(this.editingRecord, j).value.bonus;
          record.social_performance[j].comment = this.findSocialFieldsInBonusForm(this.editingRecord, j).value.comment;
        }
        this.evalService.updateEvaluationRecord(record).subscribe();
      }
      this.bonusForm.disable();
      this.editMode = !this.editMode;
    }
  }

  ngOnInit(): void {
    this.bonusForm = this.fb.group({
      formsOfRecords: this.fb.array([])
    });
    this.getEvaluationRecord();
  }
}
