import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-folder',
  templateUrl: './svg-folder.component.html',
  styleUrls: ['./svg-folder.component.scss']
})
export class SvgFolderComponent implements OnInit {

  @Input()
  width = 28;

  @Input()
  height = 15;

  constructor() { }

  ngOnInit(): void {
  }

}
