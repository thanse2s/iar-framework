import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { EvaluationrecordService } from '../../services/evaluationrecord.service';
import { Evaluationrecord } from '../../models/Evaluationrecord';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evaluation-record',
  templateUrl: './evaluation-record.component.html',
  styleUrls: ['./evaluation-record.component.css']})

export class EvaluationRecordComponent implements OnInit {

  @Input() paramEmployeeID: number;
  @Input() layout: string;
  @Input() eventEmitterEmployeeID: EventEmitter<number>;
  @Output() editModeEmitter: EventEmitter<boolean>;
  editMode: boolean;
  evaluationRecords: Evaluationrecord[] = [];
  committedBonusSalaries: number[] = [];
  pendingBonusSalaries: number[] = [];

  constructor(protected evalService: EvaluationrecordService,
              protected route: ActivatedRoute) {
    this.editMode = false;
    this.editModeEmitter = new EventEmitter<boolean>();
  }

  getEvaluationRecords(): void {
    if (this.layout === 'hr') {
      this.evalService.getUncommittedEvaluationRecords()
        .subscribe(records => {
          records.forEach(record => {
            this.addRecord(record);
          });
        });
    } else if (this.eventEmitterEmployeeID === undefined){
      this.evalService.getEvaluationRecord(this.paramEmployeeID)
        .subscribe(records => {
          records.forEach(record => {
            this.addRecord(record);
          });
        });
    } else {
      this.eventEmitterEmployeeID.subscribe(employeeID => {
        this.paramEmployeeID = employeeID;
        this.evalService.getEvaluationRecord(employeeID)
          .subscribe(records => {
            records.forEach(record => {
              this.addRecord(record);
            });
          });
      });
    }
  }
  addRecord(evalRecord: Evaluationrecord): void {
    this.committedBonusSalaries.push(0);
    this.pendingBonusSalaries.push(0);
    this.evaluationRecords.splice(this.findLoc(evalRecord, this.evaluationRecords) + 1, 0, evalRecord);
  }
  findLoc(el: Evaluationrecord, arr: Evaluationrecord[]): number {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].year > el.year
        && arr[i].employee_id === el.employee_id) {
        return i - 1;
      }
    }
    return arr.length;
  }
  getEditMode(): string {
    return this.editMode ? 'editing' : 'hide';
  }
  switchEditMode(editMode: boolean): boolean{
    this.editMode = editMode;
    this.editModeEmitter.emit(editMode);
    return editMode;
  }

  ngOnInit(): void {
    this.getEvaluationRecords();
  }
}
