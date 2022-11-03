import { Component, OnInit } from '@angular/core';
import { UsageService } from './services/usage.service';

@Component({
  selector: 'app-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss']
})
export class UsageTableComponent implements OnInit {

  hideScrollbar: boolean = true;
  hideTableScrollbar: boolean = true;

  toogleSidebar: boolean = true;

  selectedFeature: string = "";

  displayedColumns = ['s.no', 'feature name', 'total req made', 'complete %', 'max pages usage allowed', 'max doc usage allow', 'page usage done', 'page usage remaining', 'doc usage done', 'doc usage remaining', 'subscription end date'];

  tableData: any[] = [];
  filteredTableData: any[] = this.tableData;

  totalRequest: number = 0;
  remainingPages: number = 0;
  remainingDocuments: number = 0;

  search_string: string = "";

  constructor(private _usage: UsageService) { }

  ngOnInit(): void {
    this.getUsageInfo();
  }

  showFeatureData(data: string) {
    if (this.selectedFeature !== data) {
      this.selectedFeature = data
    } else {
      this.selectedFeature = ""
    }
  }

  getUsageInfo() {
    this._usage.getUsageInfo().subscribe(
      (result: any) => {
        console.log("usage data", result);

        this.tableData = result['res_data']['feature_usage_details'];
        this.filteredTableData = this.tableData;
        this.tableData.forEach((res, index) => {
          res.sno = index + 1;
          this.totalRequest = this.totalRequest + res.total_requests_made;

          if (res.feature_name === 'File Upload') {
            this.remainingPages = res.page_usage_remaining;
            this.remainingDocuments = res.document_usage_remaining;
          }
        })
      }
    )
  }

  filter() {
    this.filteredTableData = this.tableData.filter(res => {
      return res.feature_name.toLowerCase().includes(this.search_string.toLowerCase());
    });
  }

}
