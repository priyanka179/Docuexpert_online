import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-graph',
  templateUrl: './tree-graph.component.html',
  styleUrls: ['./tree-graph.component.scss']
})
export class TreeGraphComponent implements OnInit {

  thorinAndCompany: any = {
    nodes: [
      { labels: ['The Hall at Bag-End'], id: '1' },
      { labels: ['The Misty Mountains'], id: '2' },
      { labels: ['Wilderland'], id: '3' },
      { labels: ['Lonely Mountain'], id: '4' },
    ],
    relationships: [
      { id: '21', type: 'through', source: '1', target: '2' },
      { id: '22', type: 'through', source: '2', target: '3' },
      { id: '23', type: 'through', source: '3', target: '4' },
    ],
  };

  constructor() { }

  ngOnInit(): void {
  }

}
