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

  evaluationRecord: Evaluationrecord;

  orderevaluation: Orderevaluation[];

  socialperformance: Socialperformance[];

  constructor(evalService: EvaluationrecordService, private messageService: MessageService) {
    this.evalService = evalService;
  }

  getEvaluationRecord(): void {
    //this.evalService.getEvaluationrecord(66)
    //.subscribe(evalrecord => this.evaluationRecord = evalrecord);

    let testOE = new Orderevaluation("SmartHoover","HBRS", "excellent",20);
    let LeaderShipTestSP = new Socialperformance(4,4,"Leadership Competence");
    let SoCoTestSP = new Socialperformance(5,4,"Social Competence");
    this.orderevaluation.push(testOE);
    this.socialperformance.push(LeaderShipTestSP);
    this.socialperformance.push(SoCoTestSP);
    this.evaluationRecord = new Evaluationrecord(2021,66,this.socialperformance,this.orderevaluation);

  }

  ngOnInit(): void {
    this.getEvaluationRecord();
  }
}
