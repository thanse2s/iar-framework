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
    const orders: FormArray = this.fb.array([], Validators.required);
    const socials: FormArray = this.fb.array([], Validators.required);
    record.orders_evaluation.forEach(order => {
      orders.push(this.createBonusAndCommentField(order.bonus, order.comment));
    });
    record.social_performance.forEach(social => {
      socials.push(this.createBonusAndCommentField(social.bonus, social.comment));
    });
    (this.bonusForm.get('orderbonusfields') as FormArray).push(orders);
    (this.bonusForm.get('socialbonusfields') as FormArray).push(socials);
  }
  createBonusAndCommentField(bonus: number, comment: string): FormGroup {
    return this.fb.group({
      bonus: [bonus, Validators.required],
      comment: [comment, Validators.required]
    });
  }
  findBonusSalaryByIDAndYear(id: number, year: number): number {
    const salary = this.bonusSalaries.find(el => (el.employee_id === id) && (el.year === year));
    return salary !== undefined ? salary.value : 0;
  }

  ngOnInit(): void {
    this.bonusForm = this.fb.group({
      orderbonusfields: this.fb.array([]),
      socialbonusfields: this.fb.array([])
    });
    this.getEvaluationRecord();
  }
}
