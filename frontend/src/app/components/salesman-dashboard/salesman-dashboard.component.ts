import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'salesman-dashboard',
  templateUrl: './salesman-dashboard.component.html',
  styleUrls: ['./salesman-dashboard.component.css']
})
export class SalesmanDashboardComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  }; // required
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {
    this
  } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngularFlag: boolean = false; // optional boolean, defaults to false

  ngOnInit(): void {
  }


}

