import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {Evaluationrecord} from '../../models/Evaluationrecord';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BonusSalaryService} from '../../services/bonussalary.service';
import {MatExpansionPanel} from '@angular/material/expansion';

@Component({
  selector: 'app-single-eval-record',
  templateUrl: './single-eval-record.component.html',
  styleUrls: ['./single-eval-record.component.css'],
  viewProviders: [MatExpansionPanel]
})
export class SingleEvalRecordComponent implements OnInit {

  fb: FormBuilder;
  @Input() evaluationRecord: Evaluationrecord;
  forms: FormGroup;
  socialFormArray: FormArray;
  orderFormArray: FormArray;
  @Output() committedBonusSalary: EventEmitter<number>;
  @Output() pendingBonusSalary: EventEmitter<number>;
  totalBonusSalary: number;

  constructor(fb: FormBuilder,
              protected bonusSalaryService: BonusSalaryService) {
    this.committedBonusSalary = new EventEmitter<number>();
    this.pendingBonusSalary = new EventEmitter<number>();
    this.fb = fb;
    this.socialFormArray = this.fb.array([]);
    this.orderFormArray = this.fb.array([]);
    this.forms = this.fb.group({
      social: this.socialFormArray,
      order: this.orderFormArray
    });
  }

  getFormGroup(i: number, formArray: FormArray): FormGroup {
    return formArray.at(i) as FormGroup;
  }
  buildForms(records, formArray: FormArray): void {
    for (const record of records) {
      formArray.push(this.fb.group({
        bonus: [{value: record.bonus, disabled: true}, [Validators.required, Validators.min(0), Validators.max(100000000)]],
        comment: [{value: record.comment, disabled: true}]
      }));
    }
  }
  getBonusSalaries(): void {
    this.bonusSalaryService.getBonusSalary(this.evaluationRecord.employee_id)
      .subscribe(salaries => {
        console.log(salaries);
        const salary = salaries.find(el => el.year === this.evaluationRecord.year).value;
        this.committedBonusSalary.emit(salary);
        this.totalBonusSalary = this.calculateTotalBonusSalary();
        this.pendingBonusSalary.emit(this.totalBonusSalary - salary);
      });
  }
  calculateTotalBonusSalary(): number {
    let bonusSalary = 0;
    this.evaluationRecord.orders_evaluation.forEach(order => {
      bonusSalary += order.bonus;
    });
    this.evaluationRecord.social_performance.forEach(social => {
      bonusSalary += social.bonus;
    });
    return bonusSalary;
  }

  ngOnInit(): void {
    this.getBonusSalaries();
    this.buildForms(this.evaluationRecord.orders_evaluation, this.orderFormArray);
    this.buildForms(this.evaluationRecord.social_performance, this.socialFormArray);
  }

}
