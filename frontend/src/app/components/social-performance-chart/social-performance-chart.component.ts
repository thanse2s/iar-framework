import {Component, Input,  OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import StockModule from 'highcharts/modules/stock';
StockModule(Highcharts);


@Component({
  selector: 'app-social-performance-chart',
  templateUrl: './social-performance-chart.component.html',
  styleUrls: ['./social-performance-chart.component.css']
})



export class SocialPerformanceChartComponent implements OnInit {

  @Input() socialPerformancesAverages: number[] = [5,3,4]
  @Input() years: string[] = ['2019', '2020', '2021'];


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
      text: "Your Social Performance Average"
    },
    subtitle: {
      text: "Visualisation of your Social Performance Average per Year"
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: 'Social Performance Score'
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
      name: 'Social Performance',
      type: 'column',
      color: '#f4771b',
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


  updateChart(): void {
    const self = this;
    const chart = this.chart;

    chart.showLoading();
    setTimeout(() => {
      chart.hideLoading();

      this.chartOptions.series = [
        {
          type: 'column',
          data: this.socialPerformancesAverages
        }
      ];
      this.chartOptions.xAxis = {
        categories: this.years
      };

      self.updateFlag = true;
    }, 2000);
  }
}
