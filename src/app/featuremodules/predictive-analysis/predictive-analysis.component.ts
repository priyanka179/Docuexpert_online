import { Component, OnInit } from '@angular/core';
declare var Plotly: any;

@Component({
  selector: 'app-predictive-analysis',
  templateUrl: './predictive-analysis.component.html',
  styleUrls: ['./predictive-analysis.component.scss']
})
export class PredictiveAnalysisComponent implements OnInit {

  trace1 = {
    x: [1, 2, 3],
    y: ['A8492', 'A8492', 'A8492'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  
  trace2 = {
    x: [2, 3, 4],
    y: ['A8493', 'A8493', 'A8493'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  trace3 = {
    x: [4,5,6],
    y: ['A8494', 'A8494', 'A8494'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  trace4 = {
    x: [6,7,8],
    y: ['A8495', 'A8495', 'A8495'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  trace5 = {
    x: [6,7,8],
    y: ['A8496', 'A8496', 'A8496'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  trace6 = {
    x: [6,7,8],
    y: ['A8497', 'A8497', 'A8497'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  trace7 = {
    x: [6,7,8],
    y: ['A8498', 'A8498', 'A8498'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  trace8 = {
    x: [6,7,8],
    y: ['A8499', 'A8499', 'A8499'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  trace9 = {
    x: [6,7,8],
    y: ['A8410', 'A8410', 'A8410'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  trace10 = {
    x: [65,61.75,68.25],
    y: ['A8411', 'A8411', 'A8411'],
    mode: 'lines+markers',
    marker: {
      size: 10
    }
  };
  
  data = [this.trace1,this.trace2,this.trace3,this.trace4,this.trace5,this.trace6,this.trace7,this.trace8,this.trace9,this.trace10];
  
  layout = {
    title: 'Predictive Analysis',
    showlegend: false,
    height: 600,
    // width: 600
  }; 

  constructor() { }

  ngOnInit(): void {
    Plotly.newPlot('myDiv', this.data, this.layout); 
  }

}
