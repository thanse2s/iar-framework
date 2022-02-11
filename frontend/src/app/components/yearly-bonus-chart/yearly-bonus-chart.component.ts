import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {isNumeric} from "rxjs/internal-compatibility";
import {Subscription} from "rxjs";
import StockModule from 'highcharts/modules/stock';
StockModule(Highcharts);


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'yearly-bonus-pie',
  templateUrl: './yearly-bonus-chart.component.html',
  styleUrls: ['./yearly-bonus-chart.component.css']
})



export class YearlyBonusChartComponent {

  @Input() bonusPerYear: number[];
  @Input() years: string[];
  // avgPerYear: number[];
  //
  // statusReadingSubscription: Subscription;
  // updateFlag: boolean;
  // Highcharts: typeof Highcharts = Highcharts;
  // chartOptions: Highcharts.Options = {
  //   title: {
  //     text: "Yearly Bonus Income"
  //   },
  //   subtitle: {
  //     text: "Visualisation of your bonus income per year"
  //   },
  //   yAxis: {
  //     title: {
  //       text: 'Yearly Bonus'
  //     }
  //   },
  //   // xAxis: {
  //   //   title: {
  //   //     text: 'Year'
  //   //   },
  //   //   categories: this.years
  //   // },
  //   plotOptions: {
  //     series: {
  //       color: '#b91f1f'
  //     },
  //   },
  //   legend: {
  //     enabled: true
  //   }
  //   // series: [{
  //   //   type: 'column',
  //   //   color: '#00ffff'
  //   // }, {
  //   //   type: 'line',
  //   //   color: '#000000'
  //   // }]
  // };
  //
  // ngOnInit(): void {
  //   this.avgPerYear = this.getAveragePerYear(this.bonusPerYear);
  //   this.updateFlag = true;
  //
  //   this.statusReadingSubscription = this.resumeLiveService.getLiveResumeData().subscribe((liveReadings) => {
  //
  //     if (!this.updateFlag) {
  //       for (const reading of liveReadings) {
  //         if (reading.measurement_info.id > 10) {
  //           continue;
  //         }
  //         const serieIndex = this.seriesIndexMap.get(reading.measurement_info.id);
  //         if (serieIndex === undefined) {
  //           this.seriesIndexMap.set(reading.measurement_info.id, this.Highcharts.charts[0].series.length);
  //           const series = this.Highcharts.charts[0].addSeries({
  //             name: reading.measurement_info.name,
  //             type: 'spline',
  //           });
  //           series.addPoint([new Date(reading.reading.timestamp).getTime(), reading.reading.value]);
  //         } else {
  //           const dataTemp = this.Highcharts.charts[0].series[serieIndex].data;
  //           if (dataTemp[dataTemp.length - 1] !== undefined && dataTemp[dataTemp.length - 1].y !== reading.reading.value &&
  //             dataTemp[dataTemp.length - 1].x !== new Date(reading.reading.timestamp).getTime()) {
  //             const tempRandom = Math.floor((Math.random() * 10) + 1);
  //             const tempDate = new Date(reading.reading.timestamp);
  //             let tempYValue = reading.reading.value;
  //             const tempXValue = (tempDate.getTime());
  //             if (tempRandom === 5) {
  //               console.log('Insertion de NUll dans le graph pour' + reading.measurement_info.name + ' à x = ' +
  //                 tempDate.toString());
  //               tempYValue = null;
  //             }
  //             this.Highcharts.charts[0].series[serieIndex].addPoint([tempXValue, tempYValue]);
  //           }
  //         }
  //       }
  //       this.updateFlag = true;
  //     }
  //   });
  //
  // }
  //
  // ngOnDestroy() {
  //   if (this.statusReadingSubscription) {
  //     this.statusReadingSubscription.unsubscribe();
  //   }
  // }
  //
  // /*
  //   Helper Function to calculate Yearly Averages of the , given a the Complete Bonus Salary
  //  */
  // getAveragePerYear(data: number[]):number[]  {
  //   let ret: number[] = [];
  //   let tmp: number[] = [];
  //   data.forEach( singleData => {
  //     let sumTilNow: number  = tmp.reduce((pv, cv) =>  pv + cv, 0);
  //     let avg: number = (singleData + sumTilNow) / (ret.length + 1);
  //     tmp.push(singleData);
  //     ret.push(avg);
  //   });
  //   return ret;
  // }

}
