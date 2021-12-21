import {Component, OnInit} from '@angular/core';
import { Salesman } from '../../models/Salesman';
import {SalesmanService} from '../../services/salesman.service';
import {MessageService} from '../../services/message.service';


@Component({
  selector: 'app-salesman-list-page',
  templateUrl: './salesman-list-page.component.html',
  styleUrls: ['./salesman-list-page.component.css'],
})


export class SalesmanListComponent implements OnInit {

  private salesmanService: SalesmanService;
  salesmans: Salesman[] = [];

  constructor(salesmanService: SalesmanService, private messageService: MessageService) {
    this.salesmanService = salesmanService;
  }

  getSaleman(): void {
      this.salesmanService.getSalesmans()
        .subscribe(salesmans =>  this.salesmans = salesmans);
  }


  ngOnInit(): void {
    this.getSaleman();
  }

  public detail(event, salesman){
    alert('Open ' + salesman.employee_id);
  }

}
