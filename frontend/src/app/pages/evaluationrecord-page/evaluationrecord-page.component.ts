import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../services/message.service';
import {EvaluationrecordService} from '../../services/evaluationrecord.service';
import {Evaluationrecord} from '../../models/Evaluationrecord';
import {BonusSalaryService} from '../../services/bonussalary.service';
import {BonusSalary} from '../../models/BonusSalary';
import {ActivatedRoute} from '@angular/router';

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
  }

  getRouting(): void {
    this.route.params.subscribe(params => this.id = parseInt(params.id));
  }
  getEvaluationRecord(): void {
    this.evalService.getEvaluationrecord(this.id)
      .subscribe(records => {
        records.forEach(evalrecord => {
          this.addRecord(evalrecord);
          this.getBonusSalary(evalrecord.employee_id);
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
  findBonusSalaryByIDAndYear(id: number, year: number): number {
    const salary = this.bonusSalaries.find(el => (el.employee_id === id) && (el.year === year));
    return salary !== undefined ? salary.value : 0;
  }

  ngOnInit(): void {
    this.getEvaluationRecord();
  }
}
