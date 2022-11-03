import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, BarElement, LineController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale, PointElement, LineElement } from 'chart.js';

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.scss']
})
export class ProgressReportComponent implements OnInit, AfterViewInit {

  @ViewChild('main') main: ElementRef;

  multi: any[] = [
    {
      "name": "File Upload",
      "series": [
        {
          "name": "Complete",
          "value": 73000000
        },
        {
          "name": "Failed",
          "value": 89400000
        },
        {
          "name": "Pending",
          "value": 62000000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "Complete",
          "value": 309000000
        },
        {
          "name": "Failed",
          "value": 311000000
        },
        {
          "name": "Pending",
          "value": 250000000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "Complete",
          "value": 50000020
        },
        {
          "name": "Failed",
          "value": 58000000
        },
        {
          "name": "Pending",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "Complete",
          "value": 62000000
        },
        {
          "name": "Pending",
          "value": 57000000
        }
      ]
    }
  ];

  view: [number, number] = [null, 200];

  monthNames:string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  xlabelArr:string[] =[];


  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Feature';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = '% Complete';

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  @ViewChild('myChart') myChart: ElementRef;
  @ViewChild('myChart2') myChart2: ElementRef; 
  @ViewChild('graphcontainer') graphcontainer: ElementRef;

  constructor() {
    Chart.register(BarElement, LineController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale, PointElement, LineElement);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.view = [this.main.nativeElement.offsetWidth, 200]

    // const ctx2 = this.myChart2.nativeElement;
    // const myChart2 = new Chart(ctx2, {
    //   type: 'line',
    //   data: {
    //     labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June'],
    //     datasets: [
    //       {
    //         label: '% Gain',
    //         data: [3, 5, 2, 1, 5, 3],
    //         backgroundColor: '#FF6384',
    //         borderColor: '#FF6384',
    //         borderWidth: 3
    //       }
    //     ]
    //   },
    //   options: {
    //     scales: {
    //       y: {
    //         beginAtZero: true,
    //         title: {
    //           display: true,
    //           text: 'value'
    //         }
    //       },
    //       x: {
    //         title: {
    //           display: true,
    //           text: 'Date'
    //         }
    //       }
    //     }
    //   }
    // });

  }

  myChartObj:any;
  graphType:string = '';
  showGraph() {
    const ctx = this.myChart.nativeElement;
    this.graphcontainer.nativeElement.style.height = '300px';
    this.myChartObj = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.xlabelArr,
        datasets: [
          {
            label: 'Automation',
            data: [3, 5, 2, 1, 5, 3],
            backgroundColor: '#198754',
            borderColor: '#198754',
            borderWidth: 3
          },
          {
            label: 'Human',
            data: [12, 18, 6, 5, 100, 20],
            backgroundColor: '#DC3545',
            borderColor: '#DC3545',
            borderWidth: 3
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: this.graphType === 'TIME TAKEN' ? 'Hour' : this.graphType === 'PERCENTAGE' ? 'Percentage':'Hour'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 15
              }
            }
          }
        }
      }
    });
  }

  show() {
    this.xlabelArr = this.getDates(new Date(this.startDate), new Date(this.stopDate));
    if(this.myChartObj) {
      this.myChartObj.destroy();
    } else {
      
    }
    this.showGraph();
    // this.myChartObj.update();
  }

  startDate:Date = new Date();
  stopDate: Date;
  getDates(startDate:Date, stopDate:Date) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(currentDate.getDate() + ' ' + this.monthNames[currentDate.getMonth()]);
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dateArray;
  }

}

