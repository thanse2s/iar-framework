import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { EvaluationrecordService } from '../../services/evaluationrecord.service';
import { Evaluationrecord } from '../../models/Evaluationrecord';
import { Socialperformance } from '../../models/Socialperformance';
import { BonusSalaryService } from '../../services/bonussalary.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';
import {EvaluationRecordComponent} from '../evaluation-record/evaluation-record.component';

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

export class ManagerEvaluationRecordComponent extends EvaluationRecordComponent {

  editingRecord: Evaluationrecord;
  addedSocialPerformances: Socialperformance[] = [];

  constructor(evalService: EvaluationrecordService,
              bonusSalaryService: BonusSalaryService,
              messageService: MessageService,
              route: ActivatedRoute,
              fb: FormBuilder) {
    super(evalService, bonusSalaryService, messageService, route, fb);
  }

  addSocialPerformance(record: Evaluationrecord): void {
    const form = this.findFieldsInRecordRelation(record).addSocial;
    if (!form.invalid) {
      this.evalService.getCorrectBonusFromNull(record.employee_id, record.year, new Socialperformance(
        form.value.actual,
        form.value.target,
        form.value.skill,
        form.value.bonus,
        form.value.comment
      )).subscribe(evaluationRecord => {
        const newSocialPerformance = evaluationRecord.social_performance[0];
        record.social_performance.push(newSocialPerformance);
        this.addedSocialPerformances.push(newSocialPerformance);
        this.createBonusAndCommentField(newSocialPerformance, record);
        form.patchValue({skill: null, target: 5, actual: 5, bonus: null, comment: null});
      });
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
}
