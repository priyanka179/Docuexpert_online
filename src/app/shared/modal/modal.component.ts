import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { ModalService } from 'src/app/_helpers/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  maximize: boolean = true;

  @Input()
  processing: boolean = false;

  @Input()
  progressPercentage: number = 0;

  processList: string[] = [];

  progressInterval: any = null;

  processCompleted: boolean = false;

  currFeature = '';

  constructor(@Inject(DOCUMENT) public document: Document, private http: HttpClient, private _auth: AuthService, private _common: CommonnService, private router: Router, private _modal: ModalService) { }

  ngOnInit(): void {
    this._common.$featureProgressStart.subscribe(() => {
      this.startProgress();
    });

    this._common.$removeAllModals.subscribe(() => { this.stopProgress();this.processing = false });
  }

  startProgress() {
    this.stopProgress();
    this.processing = true;
    this.processCompleted = false;
    this.progressPercentage = 0;
    this.currFeature = localStorage.getItem('feature');
    let feature = localStorage.getItem('feature');
    this.processList[0] = feature;
    let formdata = new FormData;

    formdata.append('user_id', this._auth.user_id.toString());
    formdata.append('feature', feature);
    formdata.append('request_id', localStorage.getItem('request_id'));

    this.progressInterval = setInterval(() => {
      this.http.post('/web_feature/get_current_output/', formdata).subscribe((data: any) => {
        console.log(data);
        
        if (data.res_data.is_result_ready === false) {
          this.progressPercentage < 95 ? this.progressPercentage += 5 : '';
        } else {
          this.progressPercentage = 100;
          // this._modal.showFeatureProcessSuccess(feature+" completed successfully");
          this.processCompleted = true;
          this._common.$tableViewData.next(data.res_data.table_view);
          localStorage.setItem('browsable_list_size', data.res_data.browsable_list_size);
          if (this.router.url.includes('/viewDir/currentOutput')) {
            this._common.$updateCurrentOutput.next('');
            console.log("updated");
          }
          this.stopProgress();
        }
      });
    },10000);
  }

  stopProgress() {
    clearInterval(this.progressInterval);
  }

}

