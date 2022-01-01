import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {EvaluationrecordService} from '../../services/evaluationrecord.service';
import {Evaluationrecord} from '../../models/Evaluationrecord';
import {BonusSalaryService} from '../../services/bonussalary.service';
import {BonusSalary} from '../../models/BonusSalary';
import {ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormArray, FormControl, Form} from '@angular/forms';

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
    this.evalService.getEvaluationrecord(this.id)
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
    console.log(this.bonusForm);
  }
  createBonusAndCommentField(bonus: number, comment: string): FormGroup {
    return this.fb.group({
      bonus: [{value: bonus, disabled: !this.editMode}, Validators.required],
      comment: [{value: comment, disabled: !this.editMode}, Validators.required]
    });
  }
  findFieldsInBonusForm(i: number, j: number): FormGroup {
    return this.bonusForm.get(`formsOfRecords.${i}.orderForm.${j}`) as FormGroup;
  }
  findBonusSalaryByIDAndYear(id: number, year: number): number {
    const salary = this.bonusSalaries.find(el => (el.employee_id === id) && (el.year === year));
    return salary !== undefined ? salary.value : 0;
  }
  switchEditMode(): void {
    if (!this.editMode) {
      this.bonusForm.enable();
      this.editMode = !this.editMode;
    } else {
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
