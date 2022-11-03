import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss']
})
export class PreviewImageComponent implements OnInit {

  @Input()
  path: string = null;

  @Output()
  onClose = new EventEmitter();

  imgData: string = null;

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
          this.imgData = 'data:image/png;base64,'+res['body']['res_data']['encoded_string']
        }

      });
  }

  hideImg() {
    this.onClose.emit('');
  }

}
