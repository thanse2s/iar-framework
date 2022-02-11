import {Component, Input,  OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {isNumeric} from "rxjs/internal-compatibility";
import {Subscription} from "rxjs";
import StockModule from 'highcharts/modules/stock';
StockModule(Highcharts);


@Component({
  selector: 'yearly-bonus-pie',
  templateUrl: './yearly-bonus-chart.component.html',
  styleUrls: ['./yearly-bonus-chart.component.css']
})



export class YearlyBonusChartComponent implements OnInit {

  @Input() bonusPerYear: number[];
  @Input() years: string[];
  avgPerYear: number[];

  statusReadingSubscription: Subscription;
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chart;
  chartCallback;
  updateFlag: boolean = false; // optional boolean
  runOutsideAngular: boolean = false;

  chartOptions: Highcharts.Options = {
    exporting: {
      enabled: true
    },
    title: {
      text: "Yearly Bonus Income"
    },
    subtitle: {
      text: "Visualisation of your bonus income per year"
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: 'Yearly Bonus'
      }
    },
    xAxis: {
      title: {
        text: 'Year'
      }
    },
    plotOptions: {
      series: {
        color: '#b91f1f'
      },
    },
    legend: {
      enabled: true
    },
    series: [{
      name: 'Bonus',
      type: 'column',
      color: '#1fa7b5',
      data: []
    }, {
      name: 'Average',
      type: 'line',
      color: '#000000',
      data: []
    }]
  };

  constructor() {
    const self = this;

    this.chartCallback = chart => {
      self.chart = chart;
    };

  }

  ngOnInit(): void {

  }

  /*
    Helper Function to calculate Yearly Averages of the Bonus, given the Complete Bonus Salary
   */
  getAveragePerYear(data: number[]): number[] {
    if (data === null) return null;
    let ret: number[] = [];
    let tmp: number[] = [];
    data.forEach(singleData => {
      let sumTilNow: number = tmp.reduce((pv, cv) => pv + cv, 0);
      let avg: number = (singleData + sumTilNow) / (ret.length + 1);
      tmp.push(singleData);
      ret.push(avg);
    });
    return ret;
  }


  updateChart(): void {
    const self = this,
      chart = this.chart;

    chart.showLoading();
    setTimeout(() => {
      chart.hideLoading();

      this.chartOptions.series = [
        {
          type: 'column',
          data: this.bonusPerYear
        },
        {
          type: 'line',
          data: this.avgPerYear
        }
      ];
      this.chartOptions.xAxis = {
        categories: this.years
      }

      self.updateFlag = true;
    }, 2000);
  }
}
