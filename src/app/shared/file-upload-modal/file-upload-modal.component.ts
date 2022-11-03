import { Component, OnInit } from '@angular/core';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { ModalService } from 'src/app/_helpers/services/modal.service';
import { UploadDirectoryService } from 'src/app/_helpers/services/upload-directory.service';

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.scss']
})
export class FileUploadModalComponent implements OnInit {

  constructor(public _upload: UploadDirectoryService, public _modal: ModalService, private _common: CommonnService) { }

  ngOnInit(): void {
    this._common.$removeAllModals.subscribe(() => { this._upload.showUploadProgress = false });
  }

}
