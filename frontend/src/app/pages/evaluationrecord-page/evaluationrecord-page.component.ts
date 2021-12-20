import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {EvaluationrecordService} from '../../services/evaluationrecord.service';
import {Evaluationrecord} from '../../models/Evaluationrecord';
import {Orderevaluation} from '../../models/Orderevaluation';
import {Socialperformance} from '../../models/Socialperformance';

@Component({
  selector: 'app-evaluationrecord-page',
  templateUrl: './evaluationrecord-page.component.html',
  styleUrls: ['./evaluationrecord-page.component.css'],
})

export class EvaluationrecordPageComponent implements OnInit {

  private evalService: EvaluationrecordService;

  evaluationRecord: Evaluationrecord[] = [];

  orderevaluation: Orderevaluation[] = [];

  socialperformance: Socialperformance[] = [];

  constructor(evalService: EvaluationrecordService, private messageService: MessageService) {
    this.evalService = evalService;
  }

  getEvaluationRecord(): void {
    this.evalService.getEvaluationrecord(66)
      .subscribe(records => {
        records.forEach(evalrecord => {
          this.evaluationRecord.push(evalrecord);
          evalrecord.orders_evaluation.forEach(order => {
            this.orderevaluation.push(order);
          });
          evalrecord.social_performance.forEach(social => {
            this.socialperformance.push(social);
          });
        });
      });

  }

  ngOnInit(): void {
    this.getEvaluationRecord();
  }
}
