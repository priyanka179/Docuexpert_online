import { Component, Input, OnInit } from '@angular/core';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';


@Component({
  selector: 'app-svg-pdf-file',
  templateUrl: './svg-pdf-file.component.html',
  styleUrls: ['./svg-pdf-file.component.scss']
})
export class SvgPdfFileComponent implements OnInit {
  @Input()
  size = '70';

  listview:boolean=false

  constructor(public _common: CommonnService) {
    this._common.$listView.subscribe(res => {
      console.log("list view >>>>>>>>>>",res)
      this.listview=res
      if(this.listview){
        this.size='19'
      }
    })
   }

  ngOnInit(): void {
  }

}
