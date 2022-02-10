import { Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'salesman-dashboard',
  templateUrl: './salesman-dashboard.component.html',
  styleUrls: ['./salesman-dashboard.component.css']
})
export class SalesmanDashboardComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };
  ngOnInit(): void {
  }

}
