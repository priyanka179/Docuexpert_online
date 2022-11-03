import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.component.html',
  styleUrls: ['./download-modal.component.scss']
})
export class DownloadModalComponent implements OnInit {

  constructor(public _common: CommonnService, @Inject(DOCUMENT) public document: Document) { }

  ngOnInit(): void {
  }

}
