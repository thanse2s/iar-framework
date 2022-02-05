import {Component, Input, OnInit} from '@angular/core';
import {Evaluationrecord} from '../../models/Evaluationrecord';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {create} from "domain";

@Component({
  selector: 'app-single-eval-record',
  templateUrl: './single-eval-record.component.html',
  styleUrls: ['./single-eval-record.component.css']
})
export class SingleEvalRecordComponent implements OnInit {

  fb: FormBuilder;
  @Input() evaluationRecord: Evaluationrecord;
  forms: FormGroup;
  socialFormArray: FormArray;
  orderFormArray: FormArray;

  constructor(fb: FormBuilder) {
    this.fb = fb;
    this.socialFormArray = this.fb.array([]);
    this.orderFormArray = this.fb.array([]);
    this.forms = this.fb.group({
      social: this.socialFormArray,
      order: this.orderFormArray
    });
  }

  // buildFormArray(evalRecord: Evaluationrecord): void {
  //   for (const order of evalRecord.orders_evaluation) {
  //     this.orderFormArray.push(this.createForm(order));
  //   }
  //   for (const social of evalRecord.social_performance) {
  //     this.socialFormArray.push(this.createForm(social));
  //   }
  // }
  getFormGroup(i: number, formArray: FormArray): FormGroup {
    if (formArray[i] === undefined){
      const group = this.fb.group({
        bonus: [{value: 0, disabled: true}, [Validators.required, Validators.min(0), Validators.max(100000000)]],
        comment: [{value: 'This element is not loaded yet!', disabled: true}]
      });
      this.socialFormArray.push(group);
      return group;
    } else {
      return formArray[i];
    }
  }

  ngOnInit(): void {
    // this.buildFormArray(this.evaluationRecord);
  }

}
