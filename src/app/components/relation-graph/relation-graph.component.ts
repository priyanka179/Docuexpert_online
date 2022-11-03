import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-relation-graph',
  templateUrl: './relation-graph.component.html',
  styleUrls: ['./relation-graph.component.scss']
})
export class RelationGraphComponent implements OnInit {

  @Input() 
  relationGraph:any = null;

  constructor() { }

  ngOnInit(): void {
  }

}
