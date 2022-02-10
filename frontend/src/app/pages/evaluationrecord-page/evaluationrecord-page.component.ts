import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-evaluationrecord-page',
  templateUrl: './evaluationrecord-page.component.html',
  styleUrls: ['./evaluationrecord-page.component.css'],
})

export class EvaluationrecordPageComponent implements OnInit {

  employeeID: number;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getOwnUser().subscribe(user => {
      this.employeeID = user.employee_id;
    });
  }

}
