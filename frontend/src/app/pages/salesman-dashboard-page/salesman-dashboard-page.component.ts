import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'salesman-dashboard',
  templateUrl: './salesman-dashboard-page.component.html',
  styleUrls: ['./salesman-dashboard-page.component.css']
})
export class SalesmanDashboardPageComponent implements OnInit {

  constructor(public messageService: MessageService) {
  }

  ngOnInit() {
  }

}
