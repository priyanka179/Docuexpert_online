import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { VisualizeService } from '../services/visualize.service';

declare var rg:any;
declare var Papa: any;
import * as FileSaver from 'file-saver';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit {

  showResult: boolean = false;

  relationGraph: any = null;

  resultPdfUrl: any = null;

  pdfurl: any = null;

  csvData:any[] = [];

  graphData: any = null;

  currActiveTab: string = '';

  showRelationGraphView: boolean = false;

  grid1: boolean = true;
  grid2: boolean = true;
  grid3: boolean = true;
  grid4: boolean = true;

  feature:string = '';

  @ViewChild('graphcontainer') graphcontainer: ElementRef;


  // data = {
  // nodes: [
  //   {
  //     id: "companyA",
  //     type: "nodeA",
  //     imgUrl:
  //       "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/AutoNaviLogo.png/220px-AutoNaviLogo.png",
  //     level: 1
  //   },
  //   {
  //     id: "companyA-propA",
  //     type: "nodeB",
  //     label: "propA",
  //     level: 2
  //   },
  //   {
  //     id: "value1",
  //     type: "nodeC",
  //     label: "value1",
  //     level: 3
  //   },
  //   {
  //     id: "value2",
  //     type: "nodeC",
  //     label: "value2",
  //     level: 3
  //   },
  //   {
  //     id: "companyB-propA",
  //     type: "nodeB",
  //     label: "propA",
  //     level: 2
  //   },
  //   {
  //     id: "companyA-propB",
  //     type: "nodeB",
  //     label: "propB",
  //     level: 2
  //   },
  //   {
  //     id: "companyB",
  //     type: "nodeA",
  //     imgUrl:
  //       "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Baidu.svg/250px-Baidu.svg.png",
  //     level: 1
  //   }
  // ],
  // links: [
  //   {
  //     id: "1",
  //     source: "companyA",
  //     target: "companyA-propB",
  //     type: "linkA",
  //     label: "something"
  //   },
  //   {
  //     id: "2",
  //     source: "companyB-propA",
  //     target: "value2",
  //     type: "linkA",
  //     label: "something"
  //   },
  //   {
  //     id: "3",
  //     source: "companyB",
  //     target: "companyB-propA",
  //     type: "linkA",
  //     label: "something"
  //   },
  //   {
  //     id: "4",
  //     source: "companyB-propA",
  //     target: "value1",
  //     type: "linkA",
  //     label: "something"
  //   },
  //   {
  //     id: "5",
  //     source: "companyA-propA",
  //     target: "value1",
  //     type: "linkA",
  //     label: "something"
  //   },
  //   {
  //     id: "6",
  //     source: "companyA",
  //     target: "companyA-propA",
  //     type: "linkA",
  //     label: "something"
  //   },
  //   {
  //     id: "7",
  //     source: "companyA-propA",
  //     target: "value2",
  //     type: "linkA",
  //     label: "something"
  //   }
  // ]
  //        };

  data = {
    nodes: [
      {
        id: "1",
        type: "nodeB",
        label: "AD",
        level: 2
      },
      {
        id: "2",
        type: "nodeB",
        label: "SB",
        level: 2
      },
      {
        id: "3",
        type: "nodeB",
        label: "WI",
        level: 2
      },
      {
        id: "4",
        type: "nodeB",
        label: "CTM",
        level: 2
      },
    ],
    links: [
      {
        id: "10",
        source: "1",
        target: "2",
        type: "linkA",
        label: "12358"
      },
      {
        id: "12",
        source: "2",
        target: "3",
        type: "linkA",
        label: "889101"
      },
      {
        id: "13",
        source: "3",
        target: "4",
        type: "linkA",
        label: "11978"
      },
      {
        id: "14",
        source: "1",
        target: "4",
        type: "linkA",
        label: "11978"
      },
    ]
  }

  typeOptions = {
    nodes: {
      nodeA: {
        appearance: {
          contents: [
            {
              className: "Rect",
              params: {
                width: 100,
                height: 100,
                borderRadius: 10
              }
            },
            {
              className: "Image",
              params: {
                width: 80,
                height: 80,
                srcKey: "imgUrl"
              }
            }
          ]
        },
        collideRadius: 50
      },
      nodeB: {
        appearance: {
          contents: [
            {
              className: "Circle",
              params: {
                r: 40
              }
            },
            {
              className: "Text",
              params: {
                textStrKey: "label",
                isOverflowHidden: true,
                maxWidth: 60
              }
            }
          ]
        },
        collideRadius: 150
      },
      nodeC: {
        appearance: {
          contents: [
            {
              className: "Rect",
              params: {
                width: 80,
                height: 50,
                borderRadius: 5
              }
            },
            {
              className: "Text",
              params: {
                textStrKey: "label",
                isOverflowHidden: true,
                maxWidth: 80
              }
            }
          ]
        },
        collideRadius: 30
      }
    },
    links: {
      linkA: {
        describe: {
          contents: [
            {
              className: "Rect",
              params: {
                width: 50,
                height: 30,
                borderRadius: 0
              }
            },
            {
              className: "Text",
              params: {
                textStrKey: "label",
                isOverflowHidden: true,
                maxWidth: 500
              }
            }
          ]
        }
      }
    }
  };

  constructor(private renderer: Renderer2, private _visualize: VisualizeService, private sanitizer: DomSanitizer, private _common: CommonnService, private _FileSaverService: FileSaverService) { }

  ngOnInit(): void {
    this.feature = localStorage.getItem('v_feature');
  }

  grid1PdfName: string = "";
  getVisualizeData(name:string) {
    this.showRelationGraphView = false;
    
    this._visualize.getVisualizeData(name).subscribe((data:any) => {
      console.log(Object.keys(data['res_data']['encoded_string_pdf']));
      this.grid1PdfName = Object.keys(data['res_data']['encoded_string_pdf'])[0];
      
      this.readPdf(data['res_data']['encoded_string_pdf'][this.grid1PdfName],'visualize');
      this.csvData = Papa.parse(atob(data['res_data']['encoded_string_pdf']['csv']), { header: true, skipEmptyLines: true}).data;
      this.csvData.map(res => {
        res.isSelected = false;
      });
      this.graphData = data['res_data']['graph_data'];

      this.sortedCsvResult = data['res_data']['sorted_csv_res']['result'];
      console.log(this.csvData, this.graphData);
    })
  }

  gridPdfDownload(link:any,fileName:string) {
    console.log(link.toString().split(' ')[4]);
    
    FileSaver.saveAs(link.toString().split(' ')[4], fileName);
  }

  showRelationGraph(i: any,pn:string,sn:string) {
    this.unselectAllTableData();
    this.csvData[i].isSelected = true;
    this.getRelationGraphData(pn+'_'+sn+'_'+'graph');
  }

  unselectAllTableData() {
    this.csvData.forEach(res => res.isSelected = false);
  }

  graphTableData: any[] = [];
  sortedCsvResult: any = null;
  getRelationGraphData(name:string) {
    this.relationGraph = null;
    this.showRelationGraphView = false;
    
    this.graphTableData = this.sortedCsvResult[name.replace('_graph','')];
    setTimeout(() => {

      console.log(this.graphTableData,this.relationGraph);
      
      this.graphData[name].nodes.forEach((res:any) => {
        // let obj = { labels: res.labels, file: res.file };

        // let isPresent = this.graphTableData.some(res => {
        //   return res.labels === obj.labels && res.file === obj.file;
        // });

        // console.log(isPresent, this.graphTableData, obj);
        
        // if (!isPresent) {
        //   this.graphTableData.push({ labels: res.labels, file: res.file });
        // }
        // this.graphTableData.push({ labels: res.labels, file: res.file });
        res.labels = [res.labels];
        res.id = res.id.toString();
        // delete res.file;
      });

      this.graphData[name].relationships.forEach((res: any) => {
        res.id = res.id.toString();
        res.source = res.source.toString();
        res.target = res.target.toString();
      });
      
      this.relationGraph = this.graphData[name];
      console.log(this.relationGraph, this.graphTableData);
    } , 100);
  }

  openPdf(link: string, pn: string, sn: string, showGraph:boolean) {
    // console.log(link.replace('view', 'preview'));
    // this.linkId = link.split('/')[5]; 
    // console.log(this.linkId);
    
    // let linkPart = link.split('/');
    // let updatedLink = linkPart[linkPart.length-1].replace('view', 'preview');
    
    // this.resultPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link.replace('view', 'preview'));
    this.downloadableView(link);
    if (showGraph) {
      this.getRelationGraphData(pn + '_' + sn + '_' + 'graph');
    }
  }

  grid3PdfName: string = "";
  downloadableView(link:string) {
    console.log(link);
    
    this._visualize.getPdf(link).subscribe((res:any) => {
      console.log(res);
      if (res.type === HttpEventType.DownloadProgress) {
        const percentDone = Math.round(100 * res.loaded / res.total);
        this._common.loaderText = `Downloading PDF ${percentDone}%`;
      }
      if (res.type === HttpEventType.Response) {
        this.readPdf(res.body.res_data, 'download');
        this.grid3PdfName = res.body.res_name;
      }
    })
  }

  readPdf(res: any,type:string) {
    const byteCharacters = atob(res);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    let objectUrl = URL.createObjectURL(new Blob([byteArray], { type: "application/pdf" }));

    if (type === 'visualize') {
      this.pdfurl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    } else {
      this.resultPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    }
  }

  downloadPdf(link: any = "", filename: string="test.pdf") {
    FileSaver.saveAs(link.toString().split(' ')[4], filename);
  }

}
