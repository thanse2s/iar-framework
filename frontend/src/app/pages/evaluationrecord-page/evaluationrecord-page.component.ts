import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {EvaluationrecordService} from '../../services/evaluationrecord.service';
import {Evaluationrecord} from '../../models/Evaluationrecord';
import {BonusSalaryService} from '../../services/bonussalary.service';
import {BonusSalary} from '../../models/BonusSalary';
import {ActivatedRoute} from "@angular/router";

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

  constructor(evalService: EvaluationrecordService,
              bonusSalaryService: BonusSalaryService,
              private messageService: MessageService,
              private route: ActivatedRoute) {
    this.evalService = evalService;
    this.bonusSalaryService = bonusSalaryService;
    this.editMode = false;
    this.route.params.subscribe(params => this.id = parseInt(params.id));
    console.log(this.id);
  }

  getEvaluationRecord(): void {
    this.evalService.getEvaluationrecord(this.id)
      .subscribe(records => {
        records.forEach(evalrecord => {
          this.evaluationRecord.push(evalrecord);
        });
      });
  }
  getBonusSalary(): void {
    // TODO is hardcoded
    this.bonusSalaryService.getBonusSalary(5)
      .subscribe(salaries => {
        salaries.forEach(salary => {
          this.bonusSalaries.push(salary);
        });
      });
  }
  findBonusSalaryByYear(year: number): number {
    const salary = this.bonusSalaries.find(el => el.year === year);
    return salary !== undefined ? salary.value : 0;
  }

  ngOnInit(): void {
    this.getEvaluationRecord();
    this.getBonusSalary();
  }
}
