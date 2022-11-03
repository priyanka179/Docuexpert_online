import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-off-canvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.scss']
})
export class OffCanvasComponent implements OnInit {

  @Input()
  showRightCanvas: boolean = false;

  @Input()
  title: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  showCanvas() {
    console.log("fired");
    this.showRightCanvas = !this.showRightCanvas;
    console.log(this.showRightCanvas);
  }

}
