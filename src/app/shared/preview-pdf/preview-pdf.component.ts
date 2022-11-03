import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// import { PagesLoadedEvent, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var pdfjsLib: any;


@Component({
  selector: 'app-preview-pdf',
  templateUrl: './preview-pdf.component.html',
  styleUrls: ['./preview-pdf.component.scss'],
  providers: [],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0, visibility: 'hidden' })),

      transition('void <=> *', animate(400))
    ])
  ]
})
export class PreviewPdfComponent implements OnInit, OnDestroy, AfterViewInit {

  src: any = null;
  url: any = null;

  browserViewer: boolean = false;
  textRender: boolean = false;

  public scrollbar: any = undefined;
  public scrollbar2: any = undefined;

  @Input()
  path: string = null;

  public base64: any = null;

  totalPageCount: number = 0;

  currPage: any = 1;

  scrollMode: number = 0;

  isLoading: boolean = true;

  showControl: boolean = false;
  mouseOverControl: boolean = false;

  interval: any = null;

  sidebarOpen: boolean = false;

  public rotation: 0 | 90 | 180 | 270 = 0;

  currentZoomFactor: any = 'page-fit';

  public pdfViewerLoadingProgress: number = 0;

  pageRendered: boolean = false;

  pdfArr: any;

  @Output()
  onClose = new EventEmitter();

  @ViewChild('selecter') selecter: ElementRef;
  @ViewChild('pdfrender') canvas: ElementRef;

  x1 = 0; y1 = 0; x2 = 0; y2 = 0;

  showSelector: boolean = false;

  mdown: boolean = false;
  mup: boolean = false;
  mover: boolean = false;
  scrolledHeight = 0;

  showHighlightView:boolean = false;

  constructor(
    private httpClient: HttpClient,
    private _common: CommonnService,
    private sanitizer: DomSanitizer,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    // pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    //@ts-ignore
    // pdfDefaultOptions.ignoreDestinationZoom = true;
  }

  @HostListener('document:mousemove', ['$event'])
  onKeydownHandler(e: any) {
    clearTimeout(this.interval);
    this.showControl = true;
    // this._changeDetectorRef.detectChanges();
    this.interval = setTimeout(() => {
      this.mouseOverControl ? this.showControl = true : this.showControl = false;
      // this._changeDetectorRef.detectChanges();
    }, 3000);

    let canvas = this.canvas && this.canvas.nativeElement;
    let rect = canvas && canvas.getBoundingClientRect();

    this.x2 = e.clientX;
    this.y2 = e.clientY;
    if (this.mdown && !this.mup) {
      this.reCalc(false);
    }

    // console.log(e.clientY,e.pageY);

  }

  @HostListener('mousedown', ['$event'])
  onmousedown(e: any) {

    this.mdown = true;
    this.mup = false;
    this.showSelector = true;

    let canvas = this.canvas && this.canvas.nativeElement;
    let rect = canvas && canvas.getBoundingClientRect();

    // this.x1 = e.clientX - rect.left;
    // this.y1 = e.clientY - rect.top;
    this.x1 = e.clientX;
    this.y1 = e.clientY;
    this.reCalc(false);
  }

  @HostListener('mouseup', ['$event'])
  onmouseup(e: any) {
    e.preventDefault();
    this.mdown = false;
    this.mup = true;
    this.showSelector = false;
    this.reCalc(true);
  }

  highlightPdfCoodinates:any = {};
  reCalc(drawRect: boolean) {
    let div = this.selecter.nativeElement;
    let canvas = this.canvas && this.canvas.nativeElement;
    let rect = canvas && canvas.getBoundingClientRect();

    let x3 = Math.min(this.x1, this.x2);
    let x4 = Math.max(this.x1, this.x2);
    let y3 = Math.min(this.y1, this.y2);
    let y4 = Math.max(this.y1, this.y2);
    div.style.left = x3 + 'px';
    div.style.top = y3 + this.scrolledHeight + 'px'; // make selector div position fixed if not working
    div.style.width = x4 - x3 + 'px';
    div.style.height = y4 - y3 + 'px';

    // console.log(x3 - rect.left, x4 - rect.left, y3 - rect.top, y4 - rect.top);

    if (drawRect && this.mover && (x3 - rect.left) > 0) {
      let ctx = this.canvas.nativeElement.getContext('2d');
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(x3 - rect.left, y3 - rect.top, x4 - x3, y4 - y3);
      ctx.stroke();

      console.log("drawn");

      if (!this.highlightPdfCoodinates[this.currPage]) {
        this.highlightPdfCoodinates[this.currPage] = [];
      }

      this.highlightPdfCoodinates[this.currPage].push([x3 - rect.left, y3 - rect.top, x4 - x3, y4 - y3]);
      console.log(this.highlightPdfCoodinates);
      
    }
    // add scroll offset if need is selection while having scrollbar
  }

  drawRect() {
    this.highlightPdfCoodinates[this.currPage] && this.highlightPdfCoodinates[this.currPage].forEach((res:any) => {
      let ctx = this.canvas.nativeElement.getContext('2d');
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(res[0],res[1],res[2],res[3]);
      ctx.stroke();
    })
  }

  scrollled(e: any) {
    // console.log(e.target.scrollTop);
    this.scrolledHeight = e.target.scrollTop
  }

  ngOnInit(): void {
    // let formdata = new FormData;

    // formdata.append('dir_path', this.path);

    // this.httpClient.post(
    //   '/document_upload/download_output_files/',
    //   formdata, { reportProgress: true, observe: 'events' })
    //   .subscribe((res: any) => {
    //     if (res.type === HttpEventType.DownloadProgress) {
    //       const percentDone = Math.round(100 * res.loaded / res.total);
    //       this._common.loaderText = `Downloading PDF ${percentDone}%`;
    //     }

    //     if (res.type === HttpEventType.Response) {
    //       res['body']['res_data'] && this.readPdf(res['body']['res_data']['encoded_string']);
    //       // console.log(res);

    //       // this.base64 = res['body']['res_data']['encoded_string'];
    //     }

    //   });
  }

  readPdf(res: any) {
    const byteCharacters = atob(res);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    // this.src = new Blob([byteArray], { type: "application/pdf" });
    this.src = byteArray;
    this.pdfArr = byteArray;

    this.canvasPdfRender();
    // console.log(this.src, byteArray);
    // this._changeDetectorRef.detectChanges();

    // setTimeout(() => {
    //   if (!this.pageRendered) {
    //     this.browserViewer = true;
    //     this._changeDetectorRef.detectChanges();
    //   }
    // }, 5000);

    let objectUrl = URL.createObjectURL(new Blob([byteArray], { type: "application/pdf" }));
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);

    this.browserViewer = true;
    this.isLoading = false;
  }

  public ngAfterViewInit(): void {
    // const container = document.querySelector('#viewerContainer');
    // const container2 = document.querySelector('#thumbnailView');
    // this.scrollbar = new PerfectScrollbar(container, this.config);
    // this.scrollbar2 = new PerfectScrollbar(container2, this.config);

    let formdata = new FormData;

    formdata.append('dir_path', this.path);

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

  pdfDoc:any;
  canvasPdfRender() {
    pdfjsLib
      .getDocument(this.pdfArr)
      .promise.then((pdfDoc: any) => {
        this.pdfDoc = pdfDoc;
        this.totalPageCount = pdfDoc.numPages;
        if(this.showHighlightView) {
          this.renderPage();
        }
      })
      .catch((err: any) => {
        // Display error
        console.log(err);
      });

  }

  renderPage() {
    console.log(this.currPage);
    this.pdfDoc.getPage(parseInt(this.currPage)).then((page: any) => {
      console.log(this.canvas.nativeElement);
      let scale = 1
      let ctx = this.canvas.nativeElement.getContext('2d');
      // Set scale
      let viewport = page.getViewport({ scale });
      // scale = this.canvas.nativeElement.height / page.getViewport(1.0).height;
      // let viewport = page.getViewport({ scale });

      console.log(viewport.width, viewport.height);
      

      this.canvas.nativeElement.height = viewport.height;
      this.canvas.nativeElement.width = viewport.width;

      // this.canvas.nativeElement.height = 842;
      // this.canvas.nativeElement.width = 595;

      const renderCtx = {
        canvasContext: ctx,
        viewport
      };

      page.render(renderCtx).promise.then(() => {
        // if (pageNumIsPending !== null) {
        //   canvasPdfRender(pageNumIsPending);
        //   pageNumIsPending = null;
        // }
        this.drawRect();
      });

      // Output current page
      // document.querySelector('#page-num').textContent = num;
    });
  }

  nextPage() {
    if (this.currPage < this.totalPageCount) {
      this.currPage++;
      this.renderPage();
    }
  }

  prevPage() {
    if (this.currPage > 1) {
      this.currPage--;
      this.renderPage();
    }
  }

  rotate() {
    this.rotation += 90;
    if (this.rotation === 360) {
      this.rotation = 0;
    }
  }

  checkPageNum() {
    if (this.currPage > this.totalPageCount) {
      this.currPage = this.totalPageCount;
    }
    else if (this.currPage < 1) {
      this.currPage = 1;
    }
    else if (!this.currPage) {
      this.currPage = 1;
    }
    this.renderPage();
  }

  hidePdf() {
    this.onClose.emit('');
  }

  // public onPagesLoaded(pagecount: PagesLoadedEvent): void {
  //   this.totalPageCount = pagecount.pagesCount;
  //   if (this.totalPageCount > 2000) {
  //     this.scrollMode = 3;
  //     this.textRender = false;
  //   } else {
  //     this.textRender = true;
  //   }
  //   this.isLoading = false;
  // }

  onPageRendered(event: any) {
    this.pageRendered = true;
  }

  onProgress(event: any) {
    // this.pdfViewerLoadingProgress = event.loaded / event.total;
    this.pdfViewerLoadingProgress = event.percent;
    console.log(event);
  }

  updateZoomFactor(zoom: number) {
    if (this.currentZoomFactor === 'page-fit') {
      Math.floor(zoom * 100) < 35 ? this.currentZoomFactor = 50 : this.currentZoomFactor = Math.floor(zoom * 100);
      console.log("zoom", this.currentZoomFactor);
    }
  }

  zoomin() {
    this.currentZoomFactor += 5;
  }

  zoomout() {
    this.currentZoomFactor -= 5;
  }

  showHighlight() {
    if(this.showHighlightView) {
      setTimeout(() => { this.renderPage(); }, 500);
    }
  }

  ngOnDestroy(): void {
    this.base64 = null;
    this.path = null;
    this.src = null;
    this.url = null;
  }

}



// const byteCharacters = atob(res['res_data']['encoded_string']);
//         console.log(this.src);

//         const byteNumbers = new Array(byteCharacters.length);
//         for (let i = 0; i < byteCharacters.length; i++) {
//           byteNumbers[i] = byteCharacters.charCodeAt(i);
//         }

//         const byteArray = new Uint8Array(byteNumbers);
//         this.src = new Blob([byteArray], {type: "application/pdf"});