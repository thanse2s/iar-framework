import {Component, EventEmitter, Output} from '@angular/core';
import { EvaluationrecordService } from '../../services/evaluationrecord.service';
import { Socialperformance } from '../../models/Socialperformance';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';
import {SingleEvalRecordComponent} from '../single-eval-record/single-eval-record.component';
import {BonusSalaryService} from '../../services/bonussalary.service';

@Component({
  selector: 'app-manager-evaluation-record',
  templateUrl: './manager-eval-record.component.html',
  styleUrls: ['./manager-eval-record.component.css',
              '../evaluation-record/evaluation-record.component.css'],
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

export class ManagerEvaluationRecordComponent extends SingleEvalRecordComponent{

  addSocialRecordForm: FormGroup;
  addedSocialPerformances: Socialperformance[] = [];
  @Output() editModeEmitter: EventEmitter<boolean>;
  editMode: boolean;

  constructor(fb: FormBuilder,
              bonusSalaryService: BonusSalaryService,
              private evalService: EvaluationrecordService) {
    super(fb, bonusSalaryService);
    this.editModeEmitter = new EventEmitter<boolean>();
    this.editMode = false;
    this.addSocialRecordForm = this.fb.group({
      skill: [null, Validators.required],
      target: [5, [Validators.required, Validators.min(0), Validators.max(10)]],
      actual: [5, [Validators.required, Validators.min(0), Validators.max(10)]],
      bonus: [null, [Validators.min(0), Validators.max(100000000)]],
      comment: null
    });
  }

  addSocialPerformance(): void {
    if (!this.addSocialRecordForm.invalid) {
      this.evalService.getCorrectBonusFromNull(this.evaluationRecord.employee_id, this.evaluationRecord.year, new Socialperformance(
        this.addSocialRecordForm.value.actual,
        this.addSocialRecordForm.value.target,
        this.addSocialRecordForm.value.skill,
        this.addSocialRecordForm.value.bonus,
        this.addSocialRecordForm.value.comment
      )).subscribe(evaluationRecord => {
        const newSocialPerformance = evaluationRecord.social_performance[0];
        this.evaluationRecord.social_performance.push(newSocialPerformance);
        this.addedSocialPerformances.push(newSocialPerformance);
        this.getFormGroup(this.socialFormArray.length, this.socialFormArray);
        this.addSocialRecordForm.patchValue({skill: null, target: 5, actual: 5, bonus: null, comment: null});
      });
    }
  }
  enterEditMode(): void {
    if (!this.editMode) {
      this.socialFormArray.enable();
      this.orderFormArray.enable();
      this.editMode = true;
      this.editModeEmitter.emit(true);
    }
  }
  saveChanges(): void {
    if (this.editMode) {
      if (!this.forms.invalid) {
        // some fields were changed but no new social performance was added
        const touched = this.forms.touched;
        if (touched) {
          for (let i = 0; i < this.orderFormArray.length; i++) {
            const order = this.evaluationRecord.orders_evaluation[i];
            order.bonus = this.orderFormArray[i].value.bonus;
            order.comment = this.orderFormArray[i].value.comment;
          }
          for (let i = 0; i < this.socialFormArray.length; i++) {
            const social = this.evaluationRecord.social_performance[i];
            social.bonus = this.socialFormArray[i].value.bonus;
            social.comment = this.socialFormArray[i].value.comment;
          }
        }
        // Any changes occurred that need to be updated
        if (touched || this.addedSocialPerformances.length > 0) {
          this.evalService.updateEvaluationRecord(this.evaluationRecord).subscribe();
          this.addedSocialPerformances = [];
        }
        this.forms.disable();
        this.editMode = false;
        this.editModeEmitter.emit(false);
      }
    }
  }
  undoChanges(): void {
    if (this.editMode) {
      // reset social performances
      if (this.addedSocialPerformances.length > 0) {
        this.addedSocialPerformances.forEach(_ => {
          this.evaluationRecord.social_performance.pop();
        });
      }
      // reset all fields if any was touched
      if (this.forms.touched) {
        for (let i = 0; i < this.orderFormArray.length; i++) {
          const order = this.evaluationRecord.orders_evaluation[i];
          this.orderFormArray[i].patchValue({
            bonus: order.bonus,
            comment: order.comment
          });
        }
        for (let i = 0; i < this.socialFormArray.length; i++) {
          const social = this.evaluationRecord.social_performance[i];
          this.socialFormArray[i].patchValue({
            bonus: social.bonus,
            comment: social.comment
          });
        }
      }
      // leave edit-mode
      this.forms.disable();
      this.editMode = false;
      this.editModeEmitter.emit(false);
    }
  }
  getEditMode(): string {
    return this.editMode ? 'editing' : 'hide';
  }
}
