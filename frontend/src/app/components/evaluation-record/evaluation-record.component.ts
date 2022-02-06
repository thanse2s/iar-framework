import { Component, Input, OnInit } from '@angular/core';
import { EvaluationrecordService } from '../../services/evaluationrecord.service';
import { Evaluationrecord } from '../../models/Evaluationrecord';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evaluation-record',
  templateUrl: './evaluation-record.component.html',
  styleUrls: ['./evaluation-record.component.css']})

export class EvaluationRecordComponent implements OnInit {

  @Input() paramEmployeeID: number;
  editMode: boolean;
  evaluationRecords: Evaluationrecord[] = [];

  constructor(protected evalService: EvaluationrecordService,
              protected route: ActivatedRoute) {
    this.editMode = false;
  }

  getEvaluationRecord(): void {
    this.evalService.getEvaluationRecord(this.paramEmployeeID)
      .subscribe(records => {
        records.forEach(record => {
          this.addRecord(record);
        });
      });
  }
  addRecord(evalRecord: Evaluationrecord): void {
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

  ngOnInit(): void {
    this.getEvaluationRecord();
  }
}
