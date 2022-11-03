import { HttpClient, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var Papa: any;
import * as XLSX from 'xlsx'
import { AuthService } from 'src/app/auth/auth.service';
import { FileSaverService } from 'ngx-filesaver';
import { ModalService } from 'src/app/_helpers/services/modal.service';


@Component({
  selector: 'app-preview-csv',
  templateUrl: './preview-csv.component.html',
  styleUrls: ['./preview-csv.component.scss'],
})
export class PreviewCsvComponent implements OnInit, AfterViewInit {

  // csvData: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  csvData: any[] = [];

  maxColumnNum: number = 0;
  maxColumnSize: any[];

  columnSize: number = 5;

  page: number = 1;
  pageSize: number = 14;

  editRowId: any;
  editCloId: any

  isLinkClicked: boolean = false;
  isCsvSplitView: boolean = false;
  isShowFullPDF: boolean = false
  hideCsvtoggle: boolean = false
  hidepdftoggle: boolean = false
  isXlView: boolean = false



  pdfFilePath: any
  xlsxPath: any

  @Input()
  path: string = "";

  @Output()
  onClose = new EventEmitter();

  @ViewChild('csvtable') tableElement: ElementRef;

  constructor(private httpClient: HttpClient, private _common: CommonnService, private sanitizer: DomSanitizer, public _auth: AuthService, private _FileSaverService: FileSaverService,private _modal: ModalService) { }

  ngOnInit(): void {
    let formdata = new FormData;
    if (this.path.includes("Hard time dashboard") || this.path.includes("AMP Build")) {
      this.isCsvSplitView = true
    } else {
      this.isCsvSplitView = false
    }

    // console.log("dir path is",this.path,this.isCsvSplitView)

    formdata.append('dir_path', this.path);

    this.httpClient.post(
      '/document_upload/download_output_files/',
      formdata, { reportProgress: true, observe: 'events' })
      .subscribe(async (res: any) => {
        console.log("res is", res)
        if (res.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * res.loaded / res.total);
          this._common.loaderText = `Downloading CSV ${percentDone}%`;
        }

        if (res.type === HttpEventType.Response) {
          console.log(atob(res.body['res_data']['encoded_string']));

          if (res.body['res_data']['Filename'].includes('xlsx')) {
            console.log("in xlsx")
            this.isXlView = true
            // let xlsxDataParse = await this._common.xlsxtoText(res.body.res_data.encoded_string);

            // console.log(">>>>>>>>>>>>>>>>>>>>>>xlsx",xlsxDataParse)

            const byteCharacters = atob(res.body.res_data.encoded_string);
            // const byteNumbers = new Array(byteCharacters.length);
            length = byteCharacters.length
            let byteNumbers = new Uint8Array(length)
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            console.log(">>>>>>>buffer", byteNumbers.buffer)

            var data = new Uint8Array(byteNumbers.buffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
            console.log(arraylist);
            let convrtedCSV = this.convertToCSV(arraylist)
            console.log(convrtedCSV)
            let solved = await this.getMaxColumns(convrtedCSV);
            this.csvData = convrtedCSV

            // const byteArray = new Uint8Array(byteNumbers);
            // let objectUrl = URL.createObjectURL(new Blob([byteArray], { type: "application/xlsx" }));
            // this.xlsxPath = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);



          } else {
            // let csvDataParse = Papa.parse(atob(res.body['res_data']['encoded_string']));
            let csvDataParse = Papa.parse(await this._common.csvToText(res.body.res_data.encoded_string), { skipEmptyLines: true });

            console.log(csvDataParse);

            let solved = await this.getMaxColumns(csvDataParse.data);
            if (solved) {
              this.csvData = csvDataParse.data;
              this.csvData.forEach((element, ind) => {
                console.log("element is", element, ind)
                for (let i = 0; i < element.length; i++) {
                  if (element[i].includes(".pdf")) {
                    element[i] = element[i].split(/\r?\n/)
                  }
                }
              }
              )
              console.log("csv data", this.csvData)
            }
          }
        }
      });
  }

  convertToCSV(arr: any) {
    const array = [Object.keys(arr[0])].concat(arr)
    let CSVARR: any = []

    array.map(it => {
      let ele = Object.values(it).toString()
      CSVARR.push(ele.split(','))
      return Object.values(it).toString()
    })

    return CSVARR

  }

  ngAfterViewInit(): void {
    console.log(this.tableElement.nativeElement.offsetWidth);
  }

  async getMaxColumns(data: any) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < data.length; i++) {
        this.maxColumnNum = Math.max(this.maxColumnNum, data[i].length);
        if (i == data.length - 1) {
          this.maxColumnSize = new Array(this.maxColumnNum + this.columnSize).fill('');

          resolve(this.maxColumnNum);
        }
      }
    });
  }

  fillTable(len: number) {
    return new Array((this.maxColumnNum + this.columnSize) - len).fill('');
  }

  getChar(num: number) {
    return String.fromCharCode(65 + num);
  }

  hideCsv() {
    this.onClose.emit('');
  }

  isUrl(str: string) {
    let basePathList = ['Input', 'Req', 'Err_Info', 'Output', 'G_input'];

    let isUrl = basePathList.some(basePath => {
      if (str.includes(basePath)) {
        return true;
      } else {
        return false;
      }
    });

    return isUrl;
  }

  isArray(val: any) {
    return Array.isArray(val)
  }

  redirectToDir(path: string) {
    this._common.$hideExternalViewer.next('');
    console.log(path);

    if (path.includes('Input')) {
      path = path + "/"
      console.log("AFTER", path);
      this._common.redirectToDir(path, 'input');
    } else if (path.includes('Req')) {
      this._common.redirectToDir(path, 'req');
    } else if (path.includes('Err_Info')) {
      this._common.redirectToDir(path, 'err');
    } else if (path.includes('Output')) {
      this._common.redirectToDir(path, 'output');
    } else if (path.includes('G_input')) {
      path = path + "/"
      console.log("AFTER", path);
      this._common.redirectToDir(path, 'input');

    }

    // window.location.reload();
  }

  showPdfAtRight(path: string) {
    // this.pdfFilePath=path

    if (path.includes("/home/statvalu-local/mycontainer")) {
      path = path.replace("/home/statvalu-local/mycontainer/", "")
    }

    console.log(path)
    let formdata = new FormData;

    formdata.append('dir_path', path);

    this.httpClient.post(
      '/document_upload/download_output_files/',
      formdata, { reportProgress: true, observe: 'events' })
      .subscribe((res: any) => {
        if (res.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * res.loaded / res.total);
          this._common.loaderText = `Downloading PDF ${percentDone}%`;
        }

        if (res.type === HttpEventType.Response) {
          res['body']['res_data'] && this.readPdf(res['body']['res_data']['encoded_string']);
        }

      });
  }

  readPdf(res: any) {
    const byteCharacters = atob(res);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    let objectUrl = URL.createObjectURL(new Blob([byteArray], { type: "application/pdf" }));
    this.pdfFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    if (this.pdfFilePath) {
      this.isLinkClicked = true
    }

  }

  toggle(row: number, col: number) {
    this.editRowId = row + 1;
    this.editCloId = col;
  }

  myFunction() {
    console.log("csv data??>>>>", this.csvData)
  }

  saveCsv() {
    console.log("csv data??>>>>", this.csvData)
    let csv = new Blob(["\ufeff" + Papa.unparse(this.csvData, { skipEmptyLines: false })], { type: 'application/vnd.ms-excel' });

    // this._FileSaverService.save(csv, this.csvName);

    var base64data
    let name = this.path.split('/').pop()
    var reader = new FileReader();
    reader.readAsDataURL(csv);
    reader.onloadend = () => {
      base64data = reader.result;
      console.log(base64data);
      this.approveCsvAPi(name, base64data)
    }
    console.log(this.path, name)
  }

  updateCsv(cell: any, i: number, j: number, event: any) {
    let id = "td" + i + j
    console.log("LLLLLLLL", cell, i, j, id, event.innerText);
    // let val=document.getElementById(j).innerText
    // console.log("LLLLLLLLval",val);

    this.csvData[i][j] = event.innerText
  }

  // addCsv() {
  //   let arr = ["", "", "", ""]
  //   this.csvData.push(arr)
  // }

  addrow(ind:number) {
    let arr = ["", "", "", ""]
    this.csvData.splice(ind+1,0,arr)
  }
  approveCsv() {
    // let csv = new Blob(["\ufeff" + Papa.unparse(this.csvData, { skipEmptyLines: false })], { type: 'application/vnd.ms-excel' });

    // // this._FileSaverService.save(csv, this.csvName);

    // var base64data
    // let name = this.path.split('/').pop()
    // var reader = new FileReader();
    // reader.readAsDataURL(csv);
    // reader.onloadend = () => {
    //   base64data = reader.result;
    //   console.log(base64data);
    //   this.approveCsvAPi(name, base64data)
    // }
    // console.log(this.path, name)

  }

  approveCsvAPi(name: string, base64data: any) {
    console.log("inside submit")
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("file_name", name);
    formData.append("input_paths", this.path);
    formData.append("approve_array", base64data);
    return this.httpClient.post('/link_upload/save/', formData).subscribe((res: any) => {
      console.log(res)
      this._modal.showFeatureProcessSuccess(res.res_str.succ_str);
    });
  }

  downloadCsv() {
    let csv = new Blob(["\ufeff" + Papa.unparse(this.csvData, { skipEmptyLines: false })], { type: 'application/vnd.ms-excel' });
    let name = this.path.split('/').pop()
    let sub = name.substring(0, name.indexOf('.'));
    console.log(">>>",sub)
    
    this._FileSaverService.save(csv, sub+".csv");
  }

  deleterow(ind: number) {
    this.csvData.splice(ind, 1);
  }
}
