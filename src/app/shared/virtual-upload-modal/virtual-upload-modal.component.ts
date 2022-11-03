import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';

@Component({
  selector: 'app-virtual-upload-modal',
  templateUrl: './virtual-upload-modal.component.html',
  styleUrls: ['./virtual-upload-modal.component.scss']
})
export class VirtualUploadModalComponent implements OnInit {

  constructor(public _common: CommonnService, @Inject(DOCUMENT) public document: Document) { }

  ngOnInit(): void {
  }

}
