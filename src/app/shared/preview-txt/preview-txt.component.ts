import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';

@Component({
  selector: 'app-preview-txt',
  templateUrl: './preview-txt.component.html',
  styleUrls: ['./preview-txt.component.scss']
})
export class PreviewTxtComponent implements OnInit {

  @Input()
  path: string = null;

  @Output()
  onClose = new EventEmitter();

  textData: string = '';

  constructor(private httpClient: HttpClient, private _common: CommonnService) { }

  ngOnInit(): void {
    let formdata = new FormData;

    formdata.append('dir_path', this.path);

    this.httpClient.post(
      '/document_upload/download_output_files/',
      formdata, { reportProgress: true, observe: 'events' })
      .subscribe((res: any) => {
        if (res.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * res.loaded / res.total);
          this._common.loaderText = `Downloading File ${percentDone}%`;
        }

        if (res.type === HttpEventType.Response) {
          console.log(atob(res['body']['res_data']['encoded_string']));
          this.textData = atob(res['body']['res_data']['encoded_string']);
        }

      });
  }

  hideTxt() {
    this.onClose.emit('');
  }

}
