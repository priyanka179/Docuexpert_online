import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DataLakeDirectoryClient, DataLakeFileClient, DataLakeFileSystemClient, FileReadResponse } from '@azure/storage-file-datalake';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { FeatureProcessService } from 'src/app/_helpers/services/feature-process.service';
import { ModalService } from 'src/app/_helpers/services/modal.service';
import { UploadDirectoryService } from 'src/app/_helpers/services/upload-directory.service';
import Swal from 'sweetalert2';
import { DirectoryService } from './services/directory.service';
import * as JSZip from 'jszip';
import { FileSaverService } from 'ngx-filesaver';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuTrigger } from '@angular/material/menu';
import { Location } from '@angular/common'
import { AnyNsRecord } from 'dns';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { log } from 'console';
//autocomplete
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
// import { NavigationService } from './navigation.service';

export interface Fruit {
  name: string;
}

declare var gapi: any;


@Component({
  selector: 'app-input-folder',
  templateUrl: './input-folder.component.html',
  styleUrls: ['./input-folder.component.scss'],
  providers: [DirectoryService, FeatureProcessService]
})
export class InputFolderComponent implements OnInit, OnDestroy {

  //autocomplete
  // myControl = new FormControl('');
  msnFeild:any
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tagList: any = [];

  //Feature Directory show and hide ====================================================
  showAllFoldersFiles: boolean = true;
  showAllPdfFoldersFiles: boolean = false;
  showAllCsvFoldersFiles: boolean = false;
  showImageFile: boolean = false;
  showFilesMove: boolean = false;
  

  //Feature Directory show and hide ====================================================
  searchTerm: string = "";
  largeView: boolean = false;
  listViewVal: boolean = true;
  showCheckbox: boolean = false;
  isAccess: boolean = true;
  searchOption: string = "All";
  selectedFeature: string = "";
  progressPercentage: number = 0;
  processing: boolean = false;
  externalFolders: any = []
  pathList: string[] = [];
  showFullPdfPath: any
  //upload link from drive,cloud

  showUploadDrive: boolean = false;
  linkType: string = "gd";
  inputLink1: string = '';
  inputLink2: string = '';
  inputLinkForm: FormGroup;
  varifyOptions: boolean = false
  isLoggedIn: boolean = false;
  //upload link from drive,cloud

  //searching show and hide ====================================================
  showFolder: boolean = true;
  showFile: boolean = true;
  showPdfFolder: boolean = true;
  showPdfFile: boolean = true;
  showCsvFolder: boolean = true;
  showCsvFile: boolean = true;

  //searching show and hide ====================================================


  // All Folders And Files Data =================================================
  folderList: any[] = [];
  filteredFolderList: any[] = this.folderList;
  gfolderList: any[] = [];
  gfilteredFolderList: any[] = this.gfolderList;
  fileList: any[] = [];
  filteredFileList: any[] = this.fileList;
  pdfFolderList: any[] = [];
  filteredPdfFolderList: any[] = this.pdfFolderList;
  gpdfFolderList: any[] = [];
  gfilteredPdfFolderList: any[] = this.gpdfFolderList;
  pdfFileList: any[] = [];
  filteredPdfFileList: any[] = this.pdfFileList;
  csvFolderList: any[] = [];
  filteredCsvFolderList: any[] = this.csvFolderList;
  csvFileList: any[] = [];
  filteredCsvFileList: any[] = this.csvFileList;
  imageFileList: any[] = [];
  filteredImageFileList: any[] = this.imageFileList;
  csvFilesForMetadataUpdation: any[] = [];
  private history: string[] = []
  varifyQuestionList: any = []
  // varifyQuestionList = [
  //   { "question": "is Msn date validate", "response": "", "note": "" }, 
  //   { "question": "is status file validate", "response": "", "note": "" }
  // ]
  // All Folders And Files Data==============================================

  // ***********************************single/two step feature list*******************************
  // singleStepFeatures: any[] = ["Redact People Terms", "Redact Place Terms", "Redact Date Terms", "Redact Numeric", "Highlight People Term", "Highlight Place Term", "Highlight Date Term", "Highlight Numeric Terms", "Language Detection", "Affirmative Sentences", "Sentiment Detection", "Color Detection"];

  twoStepFeatures: any[] = ["Highlight Term", "Redaction Term", "Attribute Retrieval"];
  // ***********************************single/two step feature list*******************************
  selectedStep = "step1";

  // pagination of folder and files ====================================================
  page: number = 1;
  pageSize: number = 100;
  gpage: number = 1;
  gpageSize: number = 100;
  filepage: number = 1;
  filePageSize: number = 100;
  pdfPage: number = 1;
  pdfPageSize: number = 100;
  gpdfPage: number = 1;
  gpdfPageSize: number = 100;
  pdfFilePage: number = 1;
  pdfFilePageSize: number = 100;
  csvPage: number = 1;
  csvPageSize: number = 100;
  csvFilepage: number = 1;
  csvFilePageSize: number = 100;
  // pagination of folder and files ====================================================

  // open pdf/csv files ====================================================
  pdfFilePath: string = null;
  showPdfViewer: boolean = false;
  csvFilePath: string = null;
  showCsvViewer: boolean = false;
  txtFilePath: string = null;
  showTxtViewer: boolean = false;
  // open pdf/csv files ====================================================

  // Directory Properties ====================================================
  directoryMetadataKeys: any[] = [];
  directoryMetadata: any = {};
  // Directory Properties ====================================================
  featureOptions: any = { search_on: 'Google', word_list: [], approx_search: false, top_lines: '', password: '', del_attr_list: '', rule_file_path: '', page_pattern: '', page_list_or_csv: '', location: '', img_aug_customval: '', image_path: '', watermark_string: '', color: 'red', opacity: '', strokes: '', bookmark_word_or_csv: '', input_paths: [], pattern_file: '', redactPersonalInfo: { email: false, phone: false, people: false, address: false, date_of_birth: false, account_number: false, pps_number: false }, number_of_groups: '', anchor_text: '', region_size: '', height: '', split_pattern: '', input_page_list: '', order_list: [], doc_merge_filename: '', inPlace: false };

  // Show/Hide Feature Option Array ====================================================
  approxSearchFeatureList: any[] = ["Highlight Term", "Redaction Term", "Attribute Retrieval", "Anchor Text Extraction", "Anchor Text Page Classification", "Anchor Text Document Classification"];

  anchorTextFeatureList: any[] = ["Anchor Text Extraction", "Anchor Text Page Ordering", "Anchor Text Page Classification", "Anchor Text Document Classification", "Anchor Text Document Ordering"];

  showOption: string[] = ["Highlight Term", "Redaction Term", "Attribute Retrieval", "Image Augmentation", "Watermarking", "Encryption", "Decryption", "Metadata Deletion", "Metadata Updation", "Add Bookmarks", "Internal Linking", "Sentiment Detection", "Document Classification", "Redact Personal Information", "Content Based Grouping", "Extractive Summary", "Anchor Text Extraction", "Anchor Text Page Ordering", "Anchor Text Page Classification", "Anchor Text Document Classification", "Anchor Text Document Ordering", "Hight Based Highlight", "Split Pdf"];

  showCsvTableList: any[] = ["Metadata Updation", "Image Augmentation", "Watermarking", "Add Bookmarks", "Internal Linking", "Document Classification", 'AMP Build'];

  showCsvTable: boolean = false;
  // Show/Hide Feature Option Array ====================================================

  // metadata deleteion select field =============================================
  metaDataDeleteList: any[] = [{ item_id: 1, item_text: "Author" }, { item_id: 2, item_text: "Creator" }, { item_id: 3, item_text: "Creator Tool" }, { item_id: 4, item_text: "Create Date" }, { item_id: 5, item_text: "Format" }, { item_id: 6, item_text: "Instance ID" }, { item_id: 7, item_text: "Document ID" }, { item_id: 8, item_text: "History" }, { item_id: 9, item_text: "History When" }, { item_id: 10, item_text: "Modify Date" }, { item_id: 11, item_text: "Metadata Date" }, { item_id: 12, item_text: "Linearized" }, { item_id: 13, item_text: "Producer" }, { item_id: 14, item_text: "Title" }, { item_id: 15, item_text: "XMP Toolkit" }];

  dropdownSettings: any = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  // metadata deleteion select field =============================================

  // img aug,watermark,addbookmark,interlinking select option =============================================
  patterns: any[] = [
    { value: 'every page', viewValue: 'every page', feature: 'Internal Linking' },
    { value: 'every nth page', viewValue: 'every nth page', feature: '' },
    { value: 'even pages', viewValue: 'even pages', feature: '' },
    { value: 'odd pages', viewValue: 'odd pages', feature: '' },
    { value: 'page range', viewValue: 'page range', feature: 'Internal Linking' },
    { value: 'custom page numbers', viewValue: 'custom page number', feature: '' },
    { value: 'csv', viewValue: 'csv', feature: '' }
  ]
  showPaternOptionList: any[] = ["Image Augmentation", "Watermarking", "Add Bookmarks", "Internal Linking"];
  showPatternInputList: any[] = ["every nth page", "page range", "custom page numbers"];

  positions: any[] = [
    { value: '', viewValue: 'Standard Position' },
    { value: 'topleft', viewValue: 'top left' },
    { value: 'topright', viewValue: 'top right' },
    { value: 'bottomleft', viewValue: 'bottom left' },
    { value: 'bottomright', viewValue: 'bottom right' },
    { value: 'custom positions', viewValue: 'custom positions' },
  ]
  // img aug,watermark,addbookmark,interlinking select option =============================================

  // combined search =============================================
  showCombinedSearch: boolean = false;

  metadataSearchForm: FormGroup;
  airCraftSearchForm:FormGroup;
  contentSearchForm: FormGroup;
  documentFolderSearchForm: FormGroup;

  contentCheck: boolean = false;
  documentFolderCheck: boolean = false;
  metadataCheck: boolean = false;
  aircraftMetadataCheck: boolean = false;


  formsList: any[] = [{ name: 'FileName', unit: "" }, { name: 'Directory', unit: '' }, { name: 'FileSize', unit: '' }, { name: 'FileModificationDate_Time', unit: '' }, { name: 'FileAccessDate_Time', unit: '' }, { name: 'FileInodeChangeDate_Time', unit: '' }, { name: 'FilePermissions', unit: '(eg. rwxrw-r--, r-read,  w-write, x-execute)' }, { name: 'PDFVersion', unit: '(from 1.1 to 1.7)' }, { name: 'Author', unit: '' }, { name: 'CreateDate', unit: '' }, { name: 'ModifyDate', unit: '' }, { name: 'Subject', unit: '' }, { name: 'Creator', unit: '' }, { name: 'Description', unit: '' }, { name: 'Title', unit: '' }, { name: 'CreatorTool', unit: '' }, { name: 'MetadataDate', unit: '' }, { name: 'Keywords', unit: '' }, { name: 'Producer', unit: '' }, { name: 'RenditionClass', unit: '' }, { name: 'MaxPageSizeW', unit: '' }, { name: 'MaxPageSizeH', unit: '' }, { name: 'MaxPageSizeUnit', unit: '' }, { name: 'FontName', unit: '(eg. Times-Roman,Times-Bold,Courier,Courier-Bold)' }, { name: 'FontFamily', unit: '("sans-serif", e.g., Helvetica)' }, { name: 'PageCount', unit: '' }, { name: 'BoundingBox', unit: '' }, { name: 'ImageHeight', unit: '(In pixels)' }, { name: 'ImageWidth', unit: '(In pixels)' }, { name: 'ImageSize', unit: '(In pixels)' }, { name: 'Megapixels', unit: '' }];

  // Types Of Forms
  integerArr: any[] = ["ContainerVersion", "CreatorVersion", "FileSize", "FontVersion", "ImageHeight", "ImageSize", "ImageWidth", "MaxPageSizeH", "MaxPageSizeW", "Megapixels", "NPages", "PageCount", "FileModificationDate_Time", "FileAccessDate_Time", "FileInodeChangeDate_Time", "CreateDate", "ModifyDate", "MetadataDate"];

  boolArr: any[] = ["Linearized"]
  // Types Of Forms

  // Select Field optins data ==============================
  conditionIntegerList: any[] = [{ label: 'isGreaterThan', value: "gt" }, { label: 'isLessThan', value: 'lt' }, { label: 'isEqualTo', value: 'eq' }, { label: 'isGreaterThanOrEqualsTo', value: 'gte' }, { label: 'isLessThanOrEqualsTo', value: 'lte' }, { value: 'range', label: 'Range' }];

  // conditionStringList = [{ label: 'contains', value: 'contains' }, { label: 'exact', value: 'exact' }, { label: 'iexact', value: 'iexact' }, { label: 'icontains', value: 'icontains' }, { value: 'startswith', label: 'StartsWith' }, { value: 'istartswith', label: 'IStartsWith' }, { value: 'endswith', label: 'EndsWith' }, { value: 'iendswith', label: 'IEndsWith' }];

  conditionStringList = [{ label: 'contains', value: 'contains' }, { label: 'exact', value: 'exact' }, { value: 'startswith', label: 'StartsWith' }, { value: 'endswith', label: 'EndsWith' }];

  conditionBooleanList = [{ value: 'boolean', label: 'boolean' }];

  combineOp: any[] = [];

  metadataSearchData: any = {};
  metadataSearchKeys: any[] = [];

  advancedSearchType: 'File' | 'Folder' = 'File';
  // Select Field optins data ==============================
  // combined search =============================================

  // Feature select All option
  selectAllFoldersCheck: boolean = false;
  gselectAllFoldersCheck: boolean = false;
  selectAllFilesCheck: boolean = false;
  selectAllPdfFoldersCheck: boolean = false;
  gselectAllPdfFoldersCheck: boolean = false;
  selectAllPdfFilesCheck: boolean = false;
  selectAllCsvFoldersCheck: boolean = false;
  selectAllCsvFilesCheck: boolean = false;
  // Feature select All option

  //directory selection path
  selectedPdfPaths: string[] = [];
  selectedCsvPaths: string[] = [];
  //directory selection path

  docMergePdf: any[] = [];
  docMergeSelectedPdf: any[] = [];

  pdfurl: any = '';
  pdfpagenums: any[] = [];

  excelExtensionList: any[] = ['csv', 'xls'];
  imageExtensionList: any[] = ['png', 'jpg', 'jpeg'];

  allFolderNames: string[] = [];
  allFileNames: string[] = [];

  public user: SocialUser = null;

  rootDirName: string = "Myfiles";

  base_path: string = "Input_Folder/";

  showBuildDeliveryUi: boolean;
  showBuildDeliveryUi2: boolean = false;
  ispdfClicked: boolean = false;
  issearchClicked:boolean=false
  pdfFilePathright: any;
  searchPathright:any;

  showQuestionList: boolean = false;
  selectedFileForQuestion = ''
  selectAllQues = ''

  notes: boolean = false
  tag: boolean = false
  keywords: any


  constructor(public _upload: UploadDirectoryService, public _ngxService: NgxUiLoaderService, private _modal: ModalService, public _auth: AuthService, private _directory: DirectoryService, public _common: CommonnService, private route: ActivatedRoute, private _process: FeatureProcessService, private _fb: FormBuilder, private _FileSaverService: FileSaverService, private authService: SocialAuthService, private httpClient: HttpClient, private sanitizer: DomSanitizer, public router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
    })
    this._common.$resetMyFile.subscribe((res: any) => {
      let currentUrl = this.router.url;
      console.log("currrrrr url my file", currentUrl)
      if (currentUrl == '/viewDir/myfiles') {
        this.goToMyFiles()
      } else {
        localStorage.removeItem('input');
      }
    })
  }

  back() {
    this.ispdfClicked = false
    this.issearchClicked=false
    this._common.$varifyFolder.next('')
    // this.history.pop();
    if (this.pathList.length > 0) {
      this.pathList.pop();
      console.log(">>>>", this.pathList[this.pathList.length - 1])
      if (this.pathList[this.pathList.length - 1] && this.pathList[this.pathList.length - 1].includes('External_Assigned')) {
        this.isAccess = true
      }
      if (this.pathList[this.pathList.length - 1] && this.pathList[this.pathList.length - 1].includes('Delivery Bible')) {
        localStorage.removeItem("buildBibleSubDir")
      }
      this.listDirectories();
      this.storeCurrentDirPath();
    }
    // else if (this.history.length > 0) {
    //   this.location.back()
    // }
  }

  ngOnInit(): void {

    // autocomplete

    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || '')),
    // );

    this.externalFolders = [
      {
        "name": "HTD",
        "is_directory": true,
        "isSelected": false,
        "isVirtualfolder": true,
        "type": "empty",
        "path": "G_input/StatValu/PriyankaMhatre",
        "help_str": "/home/statvalu-local/mycontainer/G_input/StatValu/PriyankaMhatre/HTD",
        "file_counts": {},
        "total_files": 0,
        "total_dirs": 0,
        "directory": "Folder",
        "role": "admin"
      },
      {
        "name": "test",
        "is_directory": true,
        "isSelected": false,
        "isVirtualfolder": true,
        "type": "pdf",
        "path": "G_input/StatValu/PriyankaMhatre",
        "help_str": "/home/statvalu-local/mycontainer/G_input/StatValu/PriyankaMhatre/test",
        "file_counts": {
          "pdf": 6
        },
        "total_files": 6,
        "total_dirs": 0,
        "directory": "Folder",
        "role": "user"
      },
    ]

    this.resetDirectoryFilterPageSize();
    this.route.params.subscribe(params => {
      console.log("inside param.......................")
      let input_dir_path = JSON.parse(localStorage.getItem('input')) || [];
      let output_dir_path = JSON.parse(localStorage.getItem('output')) || [];
      let req_dir_path = JSON.parse(localStorage.getItem('req')) || [];
      let err_dir_path = JSON.parse(localStorage.getItem('err')) || [];

      localStorage.setItem(params.type, JSON.stringify(this.pathList));
      console.log("paramss", params, input_dir_path);
      this.ispdfClicked = false
      this.issearchClicked=false

      if (params.type === 'myfiles') {
        this.base_path = "Input_Folder/";
        this.pathList = input_dir_path;
        this.rootDirName = "Myfiles";
      }
      else if (params.type === 'output-folder') {
        this.base_path = "Output_Folder/";
        this.pathList = output_dir_path;
        this.rootDirName = "Output";
        this.hideContentMetaOnOtherRoutes();
        this.resetFeatureSelection();
      }
      else if (params.type === 'request-folder') {
        this.base_path = "Req_Output_Folder/";
        this.pathList = req_dir_path;
        this.rootDirName = "Request";
        this.hideContentMetaOnOtherRoutes();
        this.resetFeatureSelection();
      } else {
        this.base_path = "Err_Info_Folder/";
        this.pathList = err_dir_path;
        this.rootDirName = "Error";
        this.hideContentMetaOnOtherRoutes();
        this.resetFeatureSelection();
      }
      this.getTreeNode()
      this.listDirectories();
      console.log(">>>>>>>>>>>>", this.listViewVal, this.largeView)
    });

    this._common.$featureName.subscribe(res => {
      this.selectedFeature = res;
      console.log(res);
      this.pdfurl = null;

      this._common.currSelectedFeature = res;

      res === 'Metadata Updation' || res === 'Document Classification' || res === 'Hard time dashboard' ? this.showCsvTable = true : this.showCsvTable = false;
      res === 'Image Augmentation' ? this.showImageFile = true : this.showImageFile = false;
      this.unselectAllFoldersAndFiles();
      this.unselectAllGFolders();
      this.unselectAllPdfFoldersAndFiles();
      this.unselectAllCsvFoldersAndFiles();
      this.unselectAllImageFiles();
      this.unselectAllGPdfFolders();
      this.fillDocMergePdf();
      this.selectedPdfPaths = [];
      this.selectedCsvPaths = [];
      this.docMergeSelectedPdf = [];
      if (res) {
        this.showAllFoldersFiles = false;
        res === 'Document Classification' ? this.showDocClassificationPdfFolder() : this.showPdfDirectory();
        this.featureOptions.page_pattern = "";
        this.resetDirectoryFilter();
        this.resetFeatureSelectAll();
      } else {
        this.showAllFoldersFiles = true;
        this.showAllPdfFoldersFiles = false;
        this.showAllCsvFoldersFiles = false;
        this.selectedStep = "step1";
        this.featureOptions.page_pattern = "";
        this._common.$unselectFeatureCheckbox.next('');
        this.resetDirectoryFilter();
        this.resetFeatureSelectAll();
      }
    });
    this._common.$updateDirectory.subscribe(res => {
      this.listDirectories();
    });

    this._common.$unselectPdfCsvDirectory.subscribe(res => {
      this.unselectAllFoldersAndFiles();
      this.unselectAllGFolders();
      this.unselectAllPdfFoldersAndFiles();
      this.unselectAllCsvFoldersAndFiles();
      this.unselectAllImageFiles();
      this.unselectAllGPdfFolders();
      this.featureOptions.page_pattern = "every page";
      this.resetDirectoryFilter();
      this.resetFeatureOptions();
      this.selectedPdfPaths = [];
      this.selectedCsvPaths = [];
      this.docMergeSelectedPdf = [];
    });


    this.metadataSearchForm = this._fb.group({
      formsArray: this._fb.array(this.createForms())
    });

    this.airCraftSearchForm=this._fb.group({
      msn:[''],
      owner:[''],
      project:[''],
      type:['']
    })



    this.contentSearchForm = this._fb.group({
      text: [false],
      number: [false],
      date: [false],

      textOperator: ['AND'],
      numberOperator: ['AND'],

      textConditions: this._fb.array([
        this._fb.group({
          search_string: [''],
          condition: ['contains'],
          operator: ['AND'],
          value_type: ['text']
        })
      ]),

      numberConditions: this._fb.array([
        this._fb.group({
          search_value: [''],
          condition: ['gt'],
          operator: ['AND'],
          start: [''],
          end: ['']
        })
      ]),

      dateConditions: this._fb.array([
        this._fb.group({
          search_date: [''],
          condition: ['gt'],
          operator: ['AND'],
          start: [''],
          end: ['']
        })
      ]),
      approx_search: [false]
    })

    this.documentFolderSearchForm = this._fb.group({
      search_rule: ['', Validators.required],
      is_pattern: ['false'],
      fixed_left: ['', Validators.required],
      fixed_right: ['', Validators.required]
    })

    this.authService.authState.subscribe(user => {
      this.user = user;
      console.log(user);
    });

    this.inputLinkForm = this._fb.group({
      folderName: ['', Validators.required],
      projectName: [''],
      links: this._fb.array([this._fb.group({
        input_link: ['', Validators.required],
        name: ['', Validators.required],
        uid: [this._common.getRandomString()]
      })]),
      outputLink: ['', Validators.required]
    });

    this._common.$openDirectory.subscribe((res: any) => {
      console.log("working");
      this.showBuildDeliveryUi = false;

      this.pathList = [];
      this.pathList = res.path.split('/').slice(3);

      // let lastPath=this.pathList[this.pathList.length-1]
      // let showBible=lastPath.includes('Delivery Bible')
      // console.log("is bible render", this.pathList,showBible)

      let showBible = this.pathList.some(path => {
        return path.includes('Delivery Bible');
      });

      console.log("is bible render", this.pathList, showBible)


      if (showBible) {
        localStorage.setItem('output', JSON.stringify(this.pathList));
      } else {
        this.storeCurrentDirPath();
      }
      this.listDirectories(res.name);
      console.log(this.pathList);
    });

    this._common.$openFile.subscribe((res: any) => {
      this.openFile(res);
    });

    this._common.$refreshDirectories.subscribe((res => {
      this.pathList = JSON.parse(localStorage.getItem('output'));
      console.log("firing");

      this.listDirectories();
    }));

    this._common.$pushDirForBiblePageReordering.subscribe((res: any) => {
      this.pdfFileList.length = 0;
      this.docMergePdf.length = 0;

      this.pdfFileList = res;
      this.filteredPdfFileList = this.pdfFileList;
      res.forEach((data: any) => {
        this.docMergePdf.push({ path: data.path + '/' + data.name, isSelected: false });
      })
    });

    this._common.$hideExternalViewer.subscribe((res: any) => {
      this.showPdfViewer = false;
      this.showCsvViewer = false;
    });
  }

  dataChanged(val:any){
    console.log(">>>>>>>>>>>>",val)
// autocomplete

    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || '')),
    // );
  }
  

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addNotes() {
    this.notes = true
  }
  addTags() {
    this.tag = true
  }

  addKeywordFromInput(event: MatChipInputEvent) {
    if (event.value) {
      this.keywords.add(event.value);
      event.chipInput!.clear();
    }
  }

  removeKeyword(keyword: string) {
    this.keywords.delete(keyword);
  }

  ngAfterViewInit(): void {
    this._common.containerRef = this.directoryContainerElem.nativeElement;
  }

  // ***********************************Shortcut Keys*******************************
  @HostListener('document:keydown', ['$event'])
  onSelectHandler(evt: any) {
    if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == 65) {
      this.selectAllFoldersAndFiles()
      this.selectAllGFolders()
    }
    else if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == 90) {
      this.unselectAllFoldersAndFiles()
      this.unselectAllGFolders()
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.showPdfViewer = false;
    this.showCsvViewer = false;
  }
  // ***********************************Shortcut Keys*******************************


  // ***********************************Other Features*******************************

  //change folders,files view
  changeView() {
    this.largeView = !this.largeView;
    this.listViewVal = false
    this._common.$largView.next(this.largeView)
    this._common.$listView.next(this.listViewVal)
    console.log(this.listViewVal, this.largeView)
  }

  showEmptyDirectory(): boolean {
    return (this.filteredFolderList.length === 0) && (this.filteredFileList.length === 0) && (this.gfilteredFolderList.length === 0);
  }

  toggleCsvTable() {
    if (this.featureOptions.page_pattern === 'csv') {
      this.showCsvTable = true;
    } else {
      this.showCsvTable = false;
    }
  }

  resetFeatureSelection() {
    this._common.$unselectPdfCsvDirectory.next('');
    this._common.$unselectFeatureCheckbox.next('');
    this._common.$featureName.next('');
  }

  resetDirectoryFilter() {
    this.pdfPage = 1;
    this.pdfPageSize = parseInt(localStorage.getItem('pdffolder')) || 100;

    this.gpdfPage = 1;
    this.gpdfPageSize = parseInt(localStorage.getItem('gpdffolder')) || 100;

    this.pdfFilePage = 1;
    this.pdfFilePageSize = parseInt(localStorage.getItem('pdffile')) || 100;

    this.csvPage = 1;
    this.csvPageSize = parseInt(localStorage.getItem('csvfolder')) || 100;

    this.csvFilepage = 1;
    this.csvFilePageSize = parseInt(localStorage.getItem('csvfile')) || 100;
  }

  resetFeatureSelectAll() {
    this.selectAllPdfFoldersCheck = false;
    this.gselectAllPdfFoldersCheck = false;
    this.selectAllPdfFilesCheck = false;
    this.selectAllCsvFoldersCheck = false;
    this.selectAllCsvFilesCheck = false;
  }

  resetDirectoryFilterPageSize() {
    this.pageSize = parseInt(localStorage.getItem('folder')) || 100;
    this.gpageSize = parseInt(localStorage.getItem('gfolder')) || 100;
    this.filePageSize = parseInt(localStorage.getItem('file')) || 100;
  }

  resetFeatureOptions() {
    this.featureOptions = { search_on: 'Google', word_list: [], approx_search: false, top_lines: '', password: '', del_attr_list: '', rule_file_path: '', page_pattern: '', page_list_or_csv: '', location: '', img_aug_customval: '', image_path: '', watermark_string: '', color: 'red', opacity: '', strokes: '', bookmark_word_or_csv: '', input_paths: [], pattern_file: '', redactPersonalInfo: { email: false, phone: false, people: false, address: false, date_of_birth: false, account_number: false, pps_number: false }, number_of_groups: '', anchor_text: '', region_size: '', height: '', split_pattern: '', input_page_list: '', order_list: [], doc_merge_filename: '' };
  }

  // store filter page size when change
  storeFolderPageSize() {
    localStorage.setItem('folder', this.pageSize.toString());
  }
  storegFolderPageSize() {
    localStorage.setItem('gfolder', this.gpageSize.toString());
  }
  storeFilePageSize() {
    localStorage.setItem('file', this.filePageSize.toString());
  }
  storePdfFolderPageSize() {
    localStorage.setItem('pdffolder', this.pdfPageSize.toString());
  }
  storegPdfFolderPageSize() {
    localStorage.setItem('gpdffolder', this.gpdfPageSize.toString());
  }
  storePdfFilePageSize() {
    localStorage.setItem('pdffile', this.pdfFilePageSize.toString());
  }
  storeCsvFolderPageSize() {
    localStorage.setItem('csvfolder', this.csvPageSize.toString());
  }
  storeCsvFilePageSize() {
    localStorage.setItem('csvfile', this.csvFilePageSize.toString());
  }
  // store filter page size when change

  @ViewChild('directorycontainer') directoryContainerElem: ElementRef;
  fullscreen() {
    console.log(this.directoryContainerElem);

    if (this.directoryContainerElem.nativeElement.requestFullscreen) {
      this.directoryContainerElem.nativeElement.requestFullscreen();
    } else if (this.directoryContainerElem.nativeElement.webkitRequestFullscreen) { /* Safari */
      this.directoryContainerElem.nativeElement.webkitRequestFullscreen();
    } else if (this.directoryContainerElem.nativeElement.msRequestFullscreen) { /* IE11 */
      this.directoryContainerElem.nativeElement.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    //@ts-ignore
    else if (document.webkitExitFullscreen) { /* Safari */
      //@ts-ignore
      document.webkitExitFullscreen();
    }
    //@ts-ignore
    else if (document.msExitFullscreen) { /* IE11 */
      //@ts-ignore
      document.msExitFullscreen();
    }
  }

  getTreeNode() {
    this._common.$foldersTreeData.next({});
    let rootDir = {}
    let path = this.base_path + this._auth.org_name + '/' + this._auth.user_name;
    this._directory.getChildNodeData(path).subscribe((res: any) => {
      // console.log(res);
      console.log("parant node response", res.res_data.jsonData)
      rootDir = {
        "name": this._auth.user_name,
        "id": 0,
        "path": this.base_path + this._auth.org_name + '/' + this._auth.user_name,
        "total_count": res.res_data.jsonData.total_count,
        "type": "directory",
        "expanded": false,
      }
      console.log("parant node created", res.res_data.jsonData)
      this._common.$foldersTreeData.next(rootDir);
    });
  }

  showTreeView() {
    this._common.$showTree.next(true);
    this._common.$showFolderTree.next(false);
    this._common.$showFeatureList.next(false)
  }

  listView() {
    this.listViewVal = !this.listViewVal
    this._common.$listView.next(this.listViewVal)
    this.largeView = false
    this._common.$largView.next(this.largeView)
    console.log("list i input", this.listViewVal, this.largeView)
  }

  changeDirNameMode() {
    let nameMode = localStorage.getItem("namemode") || "short";
    if (nameMode === "short") {
      localStorage.setItem("namemode", "full");
      this._common.$nameMode.next('full');
    } else {
      localStorage.setItem("namemode", "short");
      this._common.$nameMode.next('short');
    }
  }

  // ***********************************Other Features*******************************



  // ***********************************List Directories*******************************
  showFetchDirSpinner: boolean = false;
  listDirectories(path: string = "", externalpath: string = '') {
    console.log("list dir path is " + path + "externalpath" + externalpath)
    this.showFetchDirSpinner = true;
    this.folderList.length = 0;
    this.gfolderList.length = 0;
    this.gfilteredFolderList.length = 0;
    this.fileList.length = 0;
    this.pdfFolderList.length = 0;
    this.gpdfFolderList.length = 0;
    this.pdfFileList.length = 0;
    this.docMergePdf.length = 0;
    this.csvFolderList.length = 0;
    this.csvFileList.length = 0;
    this.filteredFolderList.length = 0;
    this.filteredFileList.length = 0;
    this.imageFileList.length = 0;
    this.filteredImageFileList.length = 0;
    this.allFolderNames.length = 0;
    let dir_path = this.base_path + this._auth.org_name + '/' + this._auth.user_name;

    let nameMode = localStorage.getItem("namemode");
    this._common.$nameMode.next(nameMode);

    this.showBuildDeliveryUi = false;

    // let lastPath=this.pathList[this.pathList.length-1]
    //   let showBible=lastPath.includes('Delivery Bible')
    //   console.log("is bible render", this.pathList,showBible)
    let showBible = this.pathList.some(path => {
      return path.includes('Delivery Bible');
    });
    if (showBible) {
      this.varifyOptions = true
    } else {
      this.varifyOptions = false
    }
    console.log("?????????????", this.showFilesMove, ((showBible && this.pathList[this.pathList.length - 1].includes("Delivery Bible")) || (this.showFilesMove && this.pathList[this.pathList.length - 2].includes("Delivery Bible"))))

    // if (this.showFilesMove) {
    //   if(showBible && this.pathList[this.pathList.length - 2].includes("Delivery Bible")){
    //   this._common.$showFileMov.next(true)
    //     this.showBuildDeliveryUi = true;
    //   this.showFetchDirSpinner = false;
    //   console.log(">>>>>>>path list", this.pathList)
    //   return;
    //   }
    // } else {
    //   this.showBuildDeliveryUi = false;
    //   this._common.$showFileMov.next(false)
    // }


    // if (showBible && this.pathList.length <= 4) {
    if (showBible && this.pathList[this.pathList.length - 1].includes("Delivery Bible")) {
      this.showBuildDeliveryUi = true;
      this.showFetchDirSpinner = false;
      console.log(">>>>>>>path list", this.pathList)
      return;
    }
    // else if (showBible && this.pathList[this.pathList.length - 2].includes("Delivery Bible")) {
    //   this.showBuildDeliveryUi = true;
    //   this.showFetchDirSpinner = false;
    //   this._common.$showFileMov.next(true)
    //   console.log(">>>>>>>path list", this.pathList)
    //   return;
    // }
    else {
      this.showBuildDeliveryUi = false;
    }



    console.log(this.showBuildDeliveryUi);


    let gdir_path = '';
    if (this.base_path === 'Input_Folder/') {
      gdir_path = 'G_input/' + this._auth.org_name + '/' + this._auth.user_name;
    }
    else if (this.base_path === 'Output_Folder/') {
      gdir_path = 'G_output/' + this._auth.org_name + '/' + this._auth.user_name;
    }
    else if (this.base_path === 'Req_Output_Folder/') {
      gdir_path = 'G_Req_Output_Folder/' + this._auth.org_name + '/' + this._auth.user_name;
    }
    else if (this.base_path === 'Err_Info_Folder/') {
      gdir_path = 'G_Err_Info_Folder/' + this._auth.org_name + '/' + this._auth.user_name;
    }

    if (externalpath != '') {
      let dir_path = externalpath.split('/').slice(4);
      // dir_path.pop()
      console.log("external dir path is", dir_path.join('/'))
      let external = dir_path.join('/')
      // let path=dir_path.substring(0, dir_path.length - 1);
      // path=dir_path
      // console.log("external dir path",path)
      this.showExternalFolders(external)
    } else if (this.pathList.length > 0) {
      dir_path = dir_path + '/' + this.pathList.join('/');
      gdir_path = gdir_path + '/' + this.pathList.join('/');
      this.createFoldersAndFiles(dir_path, gdir_path);
    }
    else {
      if (path) {
        dir_path = dir_path + "/" + path;
        gdir_path = gdir_path + "/" + path;
      }
      this.createFoldersAndFiles(dir_path, gdir_path);
    }
  }


  // listexternalDirect

  showExternalFolders(path: string) {
    let gfolderInfo: any = []
    let folderInfo: any[]

    this.getExternalFolder(path).subscribe((res: any) => {
      console.log("external folder res ", res)
      this.csvFilesForMetadataUpdation = res.res_data.csv_path_list;
      folderInfo = res.res_data.file_folder_info;
      gfolderInfo = res.res_g_data.g_path_list;

      for (let i = 0; i < folderInfo.length; i++) {
        if (folderInfo[i].is_directory === true) {
          this.allFolderNames.push(folderInfo[i].name);
          folderInfo[i]['directory'] = 'Folder';
          this.folderList.push(folderInfo[i]);
          this.segregatePdfCsvFolders(folderInfo[i]);
        } else {
          if (folderInfo[i].name == "myfile.txt") {
            continue
          }
          let fileName = folderInfo[i].name.split('.');
          fileName.pop();
          this.allFileNames.push(fileName.join());
          folderInfo[i]['directory'] = 'File';
          this.fileList.push(folderInfo[i]);
          this.segregatePdfCsvFiles(folderInfo[i]);
        }
      }

      for (let i = 0; i < gfolderInfo.length; i++) {
        if (gfolderInfo[i].is_directory === true) {
          this.allFolderNames.push(gfolderInfo[i].name);
          gfolderInfo[i]['directory'] = 'Folder';
          this.gfolderList.push(gfolderInfo[i]);
          this.segregateGPdfFolders(gfolderInfo[i]);
        } else {
          let fileName = gfolderInfo[i].name.split('.');
          fileName.pop();
          this.allFileNames.push(fileName.join());
          gfolderInfo[i]['directory'] = 'File';
          this.fileList.push(gfolderInfo[i]);
          this.segregatePdfCsvFiles(gfolderInfo[i]);
        }
      }

      this.searchFoldersAndFiles();
      this.showFetchDirSpinner = false;
    })



  }

  getExternalFolder(path: string) {
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("is_external", "true");
    formData.append("dir_path", path)
    return this.httpClient.post('/filestorage_features/folder_and_files/', formData);
  }


  createFoldersAndFiles(path: string, gpath: string) {
    this._directory.listDirectories(path, gpath).subscribe(res => {
      console.log("directorys", res, path, gpath);
      let folderInfo = []
      let gfolderInfo = []

      if (path.includes('External_Assigned')) {
        gfolderInfo = res.res_g_data.file_folder_info
      } else {
        this.csvFilesForMetadataUpdation = res.res_data.csv_path_list;
        folderInfo = res.res_data.file_folder_info;
        gfolderInfo = res.res_g_data.g_path_list;
      }



      // const index = folderArray.findIndex(obj => obj.name == value);

      for (let i = 0; i < folderInfo.length; i++) {
        if (folderInfo[i].is_directory === true) {
          this.allFolderNames.push(folderInfo[i].name);
          folderInfo[i]['directory'] = 'Folder';
          this.folderList.push(folderInfo[i]);
          this.segregatePdfCsvFolders(folderInfo[i]);
        } else {
          if (folderInfo[i].name == "myfile.txt") {
            continue
          }
          let fileName = folderInfo[i].name.split('.');
          fileName.pop();
          this.allFileNames.push(fileName.join());
          folderInfo[i]['directory'] = 'File';
          this.fileList.push(folderInfo[i]);
          this.segregatePdfCsvFiles(folderInfo[i]);
        }
      }

      for (let i = 0; i < gfolderInfo.length; i++) {
        if (gfolderInfo[i].is_directory === true) {
          this.allFolderNames.push(gfolderInfo[i].name);
          gfolderInfo[i]['directory'] = 'Folder';
          this.gfolderList.push(gfolderInfo[i]);
          this.segregateGPdfFolders(gfolderInfo[i]);
        } else {
          let fileName = gfolderInfo[i].name.split('.');
          fileName.pop();
          this.allFileNames.push(fileName.join());
          gfolderInfo[i]['directory'] = 'File';
          this.fileList.push(gfolderInfo[i]);
          this.segregatePdfCsvFiles(gfolderInfo[i]);
        }
      }

      this.searchFoldersAndFiles();
      this.showFetchDirSpinner = false;
      // var image = new Image();
      // image.src = "assets/images/filetypepdf.png";
      // console.log("directorys", this.fileList);
    })
  }

  segregatePdfCsvFolders(data: any) {
    if (data.type.toLowerCase() === 'pdf') {
      let folderpath = data.path + '/' + data.name;

      if (this.selectedPdfPaths.includes(folderpath)) {
        data.isSelected = true;
      } else {
        data.isSelected = false;
      }
      this.pdfFolderList.push({ ...data });
    }
    else if (this.excelExtensionList.includes(data.type.toLowerCase())) {
      let folderpath = data.path + '/' + data.name;

      if (this.selectedCsvPaths.includes(folderpath)) {
        data.isSelected = true;
      } else {
        data.isSelected = false;
      }
      this.csvFolderList.push({ ...data });
    }
  }

  segregateGPdfFolders(data: any) {
    // if (data.type.toLowerCase() === 'pdf') {
    // }
    let folderpath = data.path + '/' + data.name;

    if (this.selectedPdfPaths.includes(folderpath)) {
      data.isSelected = true;
    } else {
      data.isSelected = false;
    }
    this.gpdfFolderList.push({ ...data });
  }

  segregatePdfCsvFiles(data: any) {
    if (data.type.toLowerCase() === 'pdf') {
      let fileData = { ...data };
      let filepath = fileData.path + '/' + fileData.name;

      if (this.selectedPdfPaths.includes(filepath)) {
        fileData.isSelected = true;
      } else {
        fileData.isSelected = false;
      }
      this.pdfFileList.push(fileData);
      if (!this.docMergeSelectedPdf.includes(fileData.path + '/' + fileData.name)) {
        this.docMergePdf.push({ path: fileData.path + '/' + fileData.name, isSelected: false });
      }
    }
    else if (this.excelExtensionList.includes(data.type.toLowerCase())) {
      let fileData = { ...data };
      let filepath = fileData.path + '/' + fileData.name;

      if (this.selectedCsvPaths.includes(filepath)) {
        fileData.isSelected = true;
      } else {
        fileData.isSelected = false;
      }
      this.csvFileList.push(fileData);
    }
    else if (this.imageExtensionList.includes(data.type.toLowerCase())) {
      this.imageFileList.push({ ...data });
    }
  }

  fillDocMergePdf() {
    this.docMergePdf.length = 0;
    this.filteredPdfFileList.forEach(fileData => {
      if (!this.docMergePdf.includes(fileData.path + '/' + fileData.name)) {
        this.docMergePdf.push({ path: fileData.path + '/' + fileData.name, isSelected: false });
      }
    })
  }

  // ***********************************List Directories*******************************

  // ***********************************For Selecting And Downloading Files*******************************

  // this.singleStepFeatures.includes(this.selectedFeature)
  selectDirectory(directoryType: string[]) {
    let dirType = directoryType[0];
    let dirName = directoryType[1];
    let dirPath = directoryType[2];
    console.log(directoryType);

    if (dirType === "Folder" && this.showAllFoldersFiles) {
      this.selectFolder(dirName, dirPath);
    }
    else if (dirType === "File" && this.showAllFoldersFiles) {
      this.selectFile(dirName, dirPath);
    }
    else if (dirType === "Folder" && this.selectedFeature && this.showAllPdfFoldersFiles === true) {
      this.selectPdfFolder(dirName, dirPath);
    }
    else if (dirType === "File" && this.selectedFeature && this.showAllPdfFoldersFiles === true) {
      this.selectPdfFile(dirName);
    }
    else if (dirType === "Folder" && this.selectedFeature && this.showAllCsvFoldersFiles === true) {
      this.selectCsvFolder(dirName);
    }
    else if (dirType === "File" && this.selectedFeature && this.showAllCsvFoldersFiles === true) {
      console.log(dirName);

      this.selectCsvFile(dirName);
    }
    else if (dirType === "File" && this.selectedFeature && this.showImageFile === true) {
      this.selectImageFile(dirName);
    }
  }

  selectPdfFolder(dirName: string, dirPath: string) {
    if (this.selectedFeature === 'Document Classification') {
      this.selectSinglePdfFolder(dirName);
      this.selectSingleGPdfFolder(dirName);
    }
    // else if (this.selectedFeature === 'Avionics listing') {
    //   this.selectTwoPdfFolder();
    // }
    else {
      if (dirPath.includes('G_input')) {
        let dirIndex = this.gfilteredPdfFolderList.findIndex(res => res.name === dirName);
        this.gfilteredPdfFolderList[dirIndex].isSelected = !this.gfilteredPdfFolderList[dirIndex].isSelected;
        this.addRemoveGFolderPdfPaths(dirIndex);
      } else {
        let dirIndex = this.filteredPdfFolderList.findIndex(res => res.name === dirName);
        this.filteredPdfFolderList[dirIndex].isSelected = !this.filteredPdfFolderList[dirIndex].isSelected;
        this.addRemoveFolderPdfPaths(dirIndex);
      }
    }
  }

  selectPdfFile(dirName: string) {
    if (this.selectedFeature === 'Document Classification' || this.selectedFeature === 'Page Reordering') {
      this.selectSinglePdfFile(dirName);
    } else {
      let dirIndex = this.filteredPdfFileList.findIndex(res => res.name === dirName);
      this.filteredPdfFileList[dirIndex].isSelected = !this.filteredPdfFileList[dirIndex].isSelected;

      this.addRemoveFilePdfPaths(dirIndex);
    }
  }

  addRemoveFilePdfPaths(dirIndex: any) {
    let isPresent = this.selectedPdfPaths.some(res => {
      return res === (this.filteredPdfFileList[dirIndex].path + '/' + this.filteredPdfFileList[dirIndex].name);
    });

    if (!isPresent && this.filteredPdfFileList[dirIndex].isSelected) {
      if (this.selectedFeature === 'Document Classification' || this.selectedFeature === 'Page Reordering') {
        this.selectedPdfPaths = [];
        this.selectedPdfPaths.push(this.filteredPdfFileList[dirIndex].path + '/' + this.filteredPdfFileList[dirIndex].name);
      } else {
        this.selectedPdfPaths.push(this.filteredPdfFileList[dirIndex].path + '/' + this.filteredPdfFileList[dirIndex].name);
      }
    } else {
      if (this.selectedFeature === 'Document Classification') {
        this.selectedPdfPaths.splice(0, 1);
      } else {
        let dirPathIndex = this.selectedPdfPaths.findIndex(res => res === (this.filteredPdfFileList[dirIndex].path + '/' + this.filteredPdfFileList[dirIndex].name));
        this.selectedPdfPaths.splice(dirPathIndex, 1);
      }
    }
    console.log(this.selectedPdfPaths);
  }

  addRemoveFileCsvPaths(dirIndex: any) {
    console.log(dirIndex);

    let isPresent = this.selectedCsvPaths.some(res => {
      return res === (this.filteredCsvFileList[dirIndex].path + '/' + this.filteredCsvFileList[dirIndex].name);
    });

    if (!isPresent && this.filteredCsvFileList[dirIndex].isSelected) {
      if (this.selectedFeature === 'Document Classification') {
        this.selectedCsvPaths = [];
        this.selectedCsvPaths.push(this.filteredCsvFileList[dirIndex].path + '/' + this.filteredCsvFileList[dirIndex].name);
      } else {
        this.selectedCsvPaths.push(this.filteredCsvFileList[dirIndex].path + '/' + this.filteredCsvFileList[dirIndex].name);
      }
    } else {
      if (this.selectedFeature === 'Document Classification') {
        this.selectedCsvPaths.splice(0, 1);
      } else {
        let dirPathIndex = this.selectedCsvPaths.findIndex(res => res === (this.filteredCsvFileList[dirIndex].path + '/' + this.filteredCsvFileList[dirIndex].name));
        this.selectedCsvPaths.splice(dirPathIndex, 1);
      }
    }
    console.log(this.selectedCsvPaths);
  }

  addRemoveFolderCsvPaths(dirIndex: any) {
    console.log(dirIndex);

    let isPresent = this.selectedCsvPaths.some(res => {
      return res === (this.filteredCsvFolderList[dirIndex].path + '/' + this.filteredCsvFolderList[dirIndex].name);
    });

    if (!isPresent && this.filteredCsvFolderList[dirIndex].isSelected) {
      if (this.selectedFeature === 'Document Classification') {
        this.selectedCsvPaths = [];
        this.selectedCsvPaths.push(this.filteredCsvFolderList[dirIndex].path + '/' + this.filteredCsvFolderList[dirIndex].name);
      } else {
        this.selectedCsvPaths.push(this.filteredCsvFolderList[dirIndex].path + '/' + this.filteredCsvFolderList[dirIndex].name);
      }
    } else {
      if (this.selectedFeature === 'Document Classification') {
        this.selectedCsvPaths.splice(0, 1);
      } else {
        let dirPathIndex = this.selectedCsvPaths.findIndex(res => res === (this.filteredCsvFolderList[dirIndex].path + '/' + this.filteredCsvFolderList[dirIndex].name));
        this.selectedCsvPaths.splice(dirPathIndex, 1);
      }
    }
    console.log(this.selectedCsvPaths);
  }

  addRemoveFolderPdfPaths(dirIndex: any) {
    let isPresent = this.selectedPdfPaths.some(res => {
      return res === (this.filteredPdfFolderList[dirIndex].path + '/' + this.filteredPdfFolderList[dirIndex].name);
    });

    if (!isPresent && this.filteredPdfFolderList[dirIndex].isSelected) {
      if (this.selectedFeature === 'Document Classification') {
        this.selectedPdfPaths = [];
        this.selectedPdfPaths.push(this.filteredPdfFolderList[dirIndex].path + '/' + this.filteredPdfFolderList[dirIndex].name);
      } else {
        this.selectedPdfPaths.push(this.filteredPdfFolderList[dirIndex].path + '/' + this.filteredPdfFolderList[dirIndex].name);
      }
    } else {
      if (this.selectedFeature === 'Document Classification') {
        this.selectedPdfPaths.splice(0, 1);
      } else {
        let dirPathIndex = this.selectedPdfPaths.findIndex(res => res === (this.filteredPdfFolderList[dirIndex].path + '/' + this.filteredPdfFolderList[dirIndex].name));
        this.selectedPdfPaths.splice(dirPathIndex, 1);
      }
    }
    console.log(this.selectedPdfPaths);
  }

  addRemoveGFolderPdfPaths(dirIndex: any) {
    let isPresent = this.selectedPdfPaths.some(res => {
      return res === (this.gfilteredPdfFolderList[dirIndex].path + '/' + this.gfilteredPdfFolderList[dirIndex].name);
    });

    if (!isPresent && this.gfilteredPdfFolderList[dirIndex].isSelected) {
      if (this.selectedFeature === 'Document Classification') {
        this.selectedPdfPaths = [];
        this.selectedPdfPaths.push(this.gfilteredPdfFolderList[dirIndex].path + '/' + this.gfilteredPdfFolderList[dirIndex].name);
      } else {
        this.selectedPdfPaths.push(this.gfilteredPdfFolderList[dirIndex].path + '/' + this.gfilteredPdfFolderList[dirIndex].name);
      }
    } else {
      if (this.selectedFeature === 'Document Classification') {
        this.selectedPdfPaths.splice(0, 1);
      } else {
        let dirPathIndex = this.selectedPdfPaths.findIndex(res => res === (this.gfilteredPdfFolderList[dirIndex].path + '/' + this.gfilteredPdfFolderList[dirIndex].name));
        this.selectedPdfPaths.splice(dirPathIndex, 1);
      }
    }
    console.log(this.selectedPdfPaths);
  }

  selectSinglePdfFolder(dirName: string) {
    for (let i = 0; i < this.filteredPdfFolderList.length; i++) {
      if (this.filteredPdfFolderList[i].name === dirName) {
        this.filteredPdfFolderList[i].isSelected = true;
        this.addRemoveFolderPdfPaths(i);
      } else {
        this.filteredPdfFolderList[i].isSelected = false;
      }
    }
  }

  // selectTwoPdfFolder() {
  //   console.log("selected two pdf folder");

  //   for (let i = 0; i < this.gfilteredPdfFolderList.length; i++) {
  //     console.log(this.gfilteredPdfFolderList[i].path);

  //     if ((this.gfilteredPdfFolderList[i].path !== this.selectedPdfPaths[0] || this.gfilteredPdfFolderList[i].path !== this.selectedPdfPaths[1]) && this.gfilteredPdfFolderList[i].isSelected) {
  //       this.gfilteredPdfFolderList[i].isSelected = true;
  //       this.addRemoveGFolderPdfPaths(i);
  //     } else {
  //       this.gfilteredPdfFolderList[i].isSelected = false;
  //       this.selectedPdfPaths.splice(1, 1);
  //     }
  //   }
  // }

  selectSingleGPdfFolder(dirName: string) {
    for (let i = 0; i < this.gfilteredPdfFolderList.length; i++) {
      if (this.gfilteredPdfFolderList[i].name === dirName) {
        this.gfilteredPdfFolderList[i].isSelected = true;
        this.addRemoveGFolderPdfPaths(i);
      } else {
        this.gfilteredPdfFolderList[i].isSelected = false;
      }
    }
  }

  selectSinglePdfFile(dirName: string) {
    for (let i = 0; i < this.filteredPdfFileList.length; i++) {
      if (this.filteredPdfFileList[i].name === dirName) {
        this.filteredPdfFileList[i].isSelected = true;
        this.addRemoveFilePdfPaths(i);

        if (this.selectedFeature === 'Page Reordering') {
          this.selectedPdfPaths[0] ? this.readPdfFromServer(this.selectedPdfPaths[0]) : this.pdfurl = '';
        }
      } else {
        this.filteredPdfFileList[i].isSelected = false;
      }
    }
  }

  selectCsvFolder(dirName: string) {
    let dirIndex = this.filteredCsvFolderList.findIndex(res => res.name === dirName);
    this.filteredCsvFolderList[dirIndex].isSelected = !this.filteredCsvFolderList[dirIndex].isSelected;

    this.addRemoveFolderCsvPaths(dirIndex);
  }

  selectCsvFile(dirName: string) {
    let dirIndex = this.filteredCsvFileList.findIndex(res => res.name === dirName);
    this.filteredCsvFileList[dirIndex].isSelected = !this.filteredCsvFileList[dirIndex].isSelected;

    console.log(dirName);

    this.addRemoveFileCsvPaths(dirIndex);
  }

  selectImageFile(dirName: string) {
    for (let i = 0; i < this.filteredImageFileList.length; i++) {
      if (this.filteredImageFileList[i].name === dirName) {
        this.filteredImageFileList[i].isSelected = true;
      } else {
        this.filteredImageFileList[i].isSelected = false;
      }
    }
  }

  selectFolder(dirName: string, dirPath: string) {
    let dirPathName = dirPath.split('/')[0];
    if (dirPathName === 'G_input') {
      let dirIndex = this.gfilteredFolderList.findIndex(res => res.name === dirName);
      this.gfilteredFolderList[dirIndex].isSelected = !this.gfilteredFolderList[dirIndex].isSelected;
    } else {
      let dirIndex = this.filteredFolderList.findIndex(res => res.name === dirName);
      this.filteredFolderList[dirIndex].isSelected = !this.filteredFolderList[dirIndex].isSelected;
    }
  }

  selectFile(dirName: string, dirPath: string) {
    let dirPathName = dirPath.split('/')[0];
    let dirIndex = this.filteredFileList.findIndex(res => res.name === dirName);
    this.filteredFileList[dirIndex].isSelected = !this.filteredFileList[dirIndex].isSelected;
  }

  selectAllFolder() {
    if (this.selectAllFoldersCheck) {
      for (let i = 0; i < this.filteredFolderList.length; i++) {
        this.filteredFolderList[i].isSelected = true;
      }
    } else {
      for (let i = 0; i < this.filteredFolderList.length; i++) {
        this.filteredFolderList[i].isSelected = false;
      }
    }
  }

  selectAllGFolder() {
    if (this.gselectAllFoldersCheck) {
      for (let i = 0; i < this.gfilteredFolderList.length; i++) {
        this.gfilteredFolderList[i].isSelected = true;
      }
    } else {
      for (let i = 0; i < this.gfilteredFolderList.length; i++) {
        this.gfilteredFolderList[i].isSelected = false;
      }
    }
  }

  selectAllFile() {
    if (this.selectAllFilesCheck) {
      for (let i = 0; i < this.filteredFileList.length; i++) {
        this.filteredFileList[i].isSelected = true;
      }
    } else {
      for (let i = 0; i < this.filteredFileList.length; i++) {
        this.filteredFileList[i].isSelected = false;
      }
    }
  }

  selectAllPdfFolder() {
    if (this.selectAllPdfFoldersCheck) {
      for (let i = 0; i < this.filteredPdfFolderList.length; i++) {
        this.filteredPdfFolderList[i].isSelected = true;
        this.addRemoveFolderPdfPaths(i);
      }
    } else {
      for (let i = 0; i < this.filteredPdfFolderList.length; i++) {
        this.filteredPdfFolderList[i].isSelected = false;
        this.addRemoveFolderPdfPaths(i);
      }
    }
  }

  selectAllGPdfFolder() {
    if (this.gselectAllPdfFoldersCheck) {
      for (let i = 0; i < this.gfilteredPdfFolderList.length; i++) {
        this.gfilteredPdfFolderList[i].isSelected = true;
        this.addRemoveGFolderPdfPaths(i);
      }
    } else {
      for (let i = 0; i < this.gfilteredPdfFolderList.length; i++) {
        this.gfilteredPdfFolderList[i].isSelected = false;
        this.addRemoveGFolderPdfPaths(i);
      }
    }
  }

  selectAllCsvFolder() {
    if (this.selectAllCsvFoldersCheck) {
      for (let i = 0; i < this.filteredCsvFolderList.length; i++) {
        this.filteredCsvFolderList[i].isSelected = true;
      }
    } else {
      for (let i = 0; i < this.filteredCsvFolderList.length; i++) {
        this.filteredCsvFolderList[i].isSelected = false;
      }
    }
  }

  selectAllPdfFile() {
    this.docMergeSelectedPdf = [];
    if (this.selectAllPdfFilesCheck) {
      for (let i = 0; i < this.docMergePdf.length; i++) {
        this.docMergeSelectedPdf.push(this.docMergePdf[i]);
      }
      for (let i = 0; i < this.filteredPdfFileList.length; i++) {
        this.filteredPdfFileList[i].isSelected = true;
        this.addRemoveFilePdfPaths(i);
      }
    } else {
      for (let i = 0; i < this.filteredPdfFileList.length; i++) {
        this.filteredPdfFileList[i].isSelected = false;
        this.addRemoveFilePdfPaths(i);
      }
      this.docMergeSelectedPdf = [];
    }
  }

  selectAllCsvFile() {
    if (this.selectAllCsvFilesCheck) {
      for (let i = 0; i < this.filteredCsvFileList.length; i++) {
        this.filteredCsvFileList[i].isSelected = true;
      }
    } else {
      for (let i = 0; i < this.filteredCsvFileList.length; i++) {
        this.filteredCsvFileList[i].isSelected = false;
      }
    }
  }

  selectAllFoldersAndFiles() {
    for (let i = 0; i < this.filteredFolderList.length; i++) {
      this.filteredFolderList[i].isSelected = true;
    }
    for (let i = 0; i < this.filteredFileList.length; i++) {
      this.filteredFileList[i].isSelected = true;
    }
  }

  selectAllGFolders() {
    for (let i = 0; i < this.gfilteredFolderList.length; i++) {
      this.gfilteredFolderList[i].isSelected = true;
    }
  }

  selectAllPdfFoldersAndFiles() {
    for (let i = 0; i < this.filteredPdfFolderList.length; i++) {
      this.filteredPdfFolderList[i].isSelected = true;
    }
    for (let i = 0; i < this.filteredPdfFileList.length; i++) {
      this.filteredPdfFileList[i].isSelected = true;
    }
  }

  selectAllCsvFoldersAndFiles() {
    for (let i = 0; i < this.filteredCsvFolderList.length; i++) {
      this.filteredCsvFolderList[i].isSelected = true;
    }
    for (let i = 0; i < this.filteredCsvFileList.length; i++) {
      this.filteredCsvFileList[i].isSelected = true;
    }
  }

  unselectAllFoldersAndFiles() {
    for (let i = 0; i < this.filteredFolderList.length; i++) {
      this.filteredFolderList[i].isSelected = false;
    }
    for (let i = 0; i < this.filteredFileList.length; i++) {
      this.filteredFileList[i].isSelected = false;
    }
  }

  unselectAllGFolders() {
    for (let i = 0; i < this.gfilteredFolderList.length; i++) {
      this.gfilteredFolderList[i].isSelected = false;
    }
  }

  unselectAllPdfFoldersAndFiles() {
    for (let i = 0; i < this.filteredPdfFolderList.length; i++) {
      this.filteredPdfFolderList[i].isSelected = false;
    }
    for (let i = 0; i < this.filteredPdfFileList.length; i++) {
      this.filteredPdfFileList[i].isSelected = false;
    }
  }

  unselectAllGPdfFolders() {
    for (let i = 0; i < this.gfilteredPdfFolderList.length; i++) {
      this.gfilteredPdfFolderList[i].isSelected = false;
    }
  }

  unselectAllCsvFoldersAndFiles() {
    for (let i = 0; i < this.filteredCsvFolderList.length; i++) {
      this.filteredCsvFolderList[i].isSelected = false;
    }
    for (let i = 0; i < this.filteredCsvFileList.length; i++) {
      this.filteredCsvFileList[i].isSelected = false;
    }
  }

  unselectAllImageFiles() {
    for (let i = 0; i < this.filteredImageFileList.length; i++) {
      this.filteredImageFileList[i].isSelected = false;
    }
  }

  async download() {
    let showBible = this.pathList.some(path => {
      return path.includes('Delivery Bible');
    });

    if (showBible) {
      this._common.$downloadBible.next(true);
      return;
    }




    let downloadFolderList = this.filteredFolderList.filter(res => res.isSelected === true);
    let downloadFileList = this.filteredFileList.filter(res => res.isSelected === true);



    let folderPathList: any[] = [];
    let filePathList: any[] = [];


    downloadFolderList.map(res => folderPathList.push(res.path.slice(13) + '/' + res.name));
    downloadFileList.map(res => filePathList.push(res.path.slice(13) + '/' + res.name));


    // downloadFolderList.map(res => folderPathList.push(res.path+ '/' + res.name));
    // downloadFileList.map(res => filePathList.push(res.path + '/' + res.name));

    let downloadPathList = [...folderPathList, ...filePathList];
    console.log("???????", downloadPathList)

    if (downloadPathList.length <= 0) {
      this._modal.showMsg("No File Selected To Download", "Error!", "error");
      return;
    }


    this._directory.download(downloadPathList, this.base_path).subscribe(res => {
      this.unselectAllFoldersAndFiles();
      this.unselectAllGFolders();
      if (res.type === HttpEventType.DownloadProgress) {
        this._common.showDownloadModal = true;
        this._ngxService.stop();
        const percentDone = Math.round(100 * res.loaded / res.total);
        this._common.downloadedData = res.loaded;
        this._common.totalDownloadFileSize = res.total;
        this._common.downloadProgress = percentDone;
      }
      if (res.type === HttpEventType.Response) {
        this._common.downloadComplete = true;
        this._FileSaverService.save((<any>res).body, "DocuExpertDoc");
      }
    });
  }

  // ***********************************For Selecting And Downloading Files*******************************

  // ***********************************For Searching Folders and Files*******************************
  searchFoldersAndFiles() {
    if (this.searchOption === "All") {
      this.filteredFolderList = this.folderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.gfilteredFolderList = this.gfolderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.filteredFileList = this.fileList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.filteredPdfFolderList = this.pdfFolderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.gfilteredPdfFolderList = this.gpdfFolderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.filteredPdfFileList = this.pdfFileList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.filteredCsvFolderList = this.csvFolderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      this.filteredCsvFileList = this.csvFileList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.showFolder = true;
      this.showFile = true;

      this.showPdfFolder = true;
      this.showPdfFile = true;

      this.showCsvFolder = true;
      this.showCsvFile = true;
    }
    else if (this.searchOption === "Folders") {
      this.filteredFolderList = this.folderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.gfilteredFolderList = this.gfolderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.filteredPdfFolderList = this.pdfFolderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.gfilteredPdfFolderList = this.gpdfFolderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.filteredCsvFolderList = this.csvFolderList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.showFolder = true;
      this.showFile = false;

      this.showPdfFolder = true;
      this.showPdfFile = false;

      this.showCsvFolder = true;
      this.showCsvFile = false;
    }
    else if (this.searchOption === "Files") {
      this.filteredFileList = this.fileList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.filteredPdfFileList = this.pdfFileList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.filteredCsvFileList = this.csvFileList.filter(res => res.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      this.showFolder = false;
      this.showFile = true;

      this.showPdfFolder = false;
      this.showPdfFile = true;

      this.showCsvFolder = false;
      this.showCsvFile = true;
    }
  }

  resetFoldersAndFiles() {
    if (this.searchOption === "All") {
      this.searchFoldersAndFiles();
    }
    else if (this.searchOption === "Folders") {
      this.filteredFileList = this.fileList;

      this.filteredPdfFileList = this.pdfFileList;

      this.filteredCsvFileList = this.csvFileList;

      this.searchFoldersAndFiles();
    }
    else if (this.searchOption === "Files") {
      this.filteredFolderList = this.folderList;

      this.filteredPdfFolderList = this.pdfFolderList;

      this.filteredCsvFolderList = this.csvFolderList;

      this.searchFoldersAndFiles();
    }
  }
  // ***********************************For Searching Folders and Files*******************************


  // ***********************************When Double Click On Folders Path handling*******************************
  openDirectory(directoryData: any) {
    // if (directoryData.isVirtualfolder) {
    //   this._modal.showMsg('Not allowed', 'Not Allowed', 'info');
    //   return;
    // }
    console.log("LLLLLpath", directoryData.path.split('/')[0])
    localStorage.setItem("advParent", directoryData.path.split('/')[0])
    let externalpath = ''
    console.log("directoryDatadirectoryDatadirectoryData", directoryData)
    if ('role' in directoryData) {
      console.log("role is ", directoryData.role)
      if (directoryData.role == 'user') {
        this.isAccess = false
      } else {
        this.isAccess = true
      }
    }
    this.pathList.push(directoryData.name)
    this.page = 1;
    this.filepage = 1;
    this.searchTerm = '';

    this.storeCurrentDirPath();

    // var image = new Image();
    // image.src = "assets/images/filetypepdf.png";

    if (this.pathList.includes('External_Assigned') && this.pathList[this.pathList.length - 1] != "External_Assigned") {
      externalpath = directoryData.help_str
      console.log("in external path is", externalpath)
    } else {
      externalpath = ''
      console.log("in external path is", externalpath)
    }
    this.listDirectories(directoryData.name, externalpath);
  }



  goToPath(path: string, index: any) {
    this.ispdfClicked = false
    this.issearchClicked=false
    this._common.$varifyFolder.next('')
    console.log("path is/// ", path, index)
    if (path.includes('External_Assigned')) {
      this.isAccess = true
    }
    if (path.includes('Delivery Bible')) {
      localStorage.removeItem("buildBibleSubDir")
    }
    let pathListLen = index + 1;
    if (pathListLen !== this.pathList.length) {
      this.pathList.splice(index + 1);
      this.listDirectories();
      this.storeCurrentDirPath();
    } else {
      console.log("current dir");
    }
  }

  goToMyFiles() {
    this.pathList = [];
    this.storeCurrentDirPath();
    this.listDirectories();
  }

  storeCurrentDirPath() {
    console.log("pathlist is", this.pathList)
    if (this.base_path === "Input_Folder/") {
      localStorage.setItem('input', JSON.stringify(this.pathList));
    }
    else if (this.base_path === "Output_Folder/") {
      localStorage.setItem('output', JSON.stringify(this.pathList));
    }
    else if (this.base_path === "Req_Output_Folder/") {
      localStorage.setItem('req', JSON.stringify(this.pathList));
    } else {
      localStorage.setItem('err', JSON.stringify(this.pathList));
    }
  }
  // ***********************************When Double Click On Folders Path handling*******************************

  // ***********************************When Double Click On Files Open it / open only csv using paths*******************************
  showImgViewer: boolean = false;
  imgFilePath: string = "";
  openFile(directory: any, mergePdf: boolean = false) {

    if (mergePdf) {
      // this.pdfFilePath = directory.path;
      // this.showPdfViewer = true;
      this.readPdfFromServer(directory.path);
    }
    else if (directory.type.toLowerCase() === 'pdf') {
      this.showFullPdfPath = directory.path + '/' + directory.name;
      // this.pdfFilePath = directory.path + '/' + directory.name;
      // this.showPdfViewer = true;
      this.showPdfAtRight(directory.path + '/' + directory.name)
    }
    else if (directory.type.toLowerCase() === 'csv' || directory.type.toLowerCase() === 'xls' || directory.type.toLowerCase() === 'xlsx') {
      this.csvFilePath = directory.path + '/' + directory.name;
      this.showCsvViewer = true;
    }
    else if (directory.type.toLowerCase() === 'txt') {
      this.txtFilePath = directory.path + '/' + directory.name;
      this.showTxtViewer = true;
    }
    else {
      this.imgFilePath = directory.path + '/' + directory.name;
      this.showImgViewer = true;
    }
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
          console.log("////////res", res)
          res['body']['res_data'] && this.readPdfright(res['body']['res_data']['encoded_string'],"viewPdf");
        }

      });
  }

  readPdfright(res: any,type:string) {
    const byteCharacters = atob(res);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    let objectUrl = URL.createObjectURL(new Blob([byteArray], { type: "application/pdf" }));
    if(type=="viewPdf"){
      this.pdfFilePathright = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
      console.log("pdf>>??>>??>??>", res, objectUrl, this.pdfFilePathright)
      if (this.pdfFilePathright) {
        this.ispdfClicked = true
      } else {
        this.ispdfClicked = false
      }
    }else if(type=="searchPdf"){
      this.searchPathright = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
      console.log("search>>??>>??>??>", res, objectUrl, this.searchPathright)
      if (this.searchPathright) {
        this.ispdfClicked = false
        this.issearchClicked = true
      } else {
        this.issearchClicked = false
      }
    }
    

    // console.log(this.pdfFilePathright, this.ispdfClicked)


  }

  closeSearchView(){
    this.issearchClicked = false
    this.ispdfClicked = true
  }

  showFullPdf() {
    this.pdfFilePath = this.showFullPdfPath
    this.showPdfViewer = true;
  }
  openCsv(path: string) {
    this.csvFilePath = path;
    this.showCsvViewer = true;
  }
  // ***********************************When Double Click On Filess Open / open only csv using paths it*******************************


  // ***********************************Processing When User Click On Process Button*******************************
  process() {

    if (this.selectedFeature === 'NIS calculation' || this.selectedFeature === 'Back2birth calculation' || this.selectedFeature === 'Avionics listing') {
      localStorage.setItem('request_id', 'BFSSFFSV76');
      localStorage.setItem('feature', this.selectedFeature);
      localStorage.setItem('browsable_list_size', '1');

      if (this.selectedPdfPaths.length === 1 && this.selectedFeature === 'Avionics listing') {
        localStorage.setItem('Avionics Pdf count', '1');
      }
      else if (this.selectedPdfPaths.length === 2 && this.selectedFeature === 'Avionics listing') {
        localStorage.setItem('Avionics Pdf count', '2');
      }
      else {
        localStorage.removeItem('Avionics Pdf count');
      }

      this.router.navigate(['/viewDir/currentOutput']);
      return;
    }

    this.closeFullscreen();
    if (!this.selectedFeature) {
      return;
    }

    let selectedPdfFolder = this.filteredPdfFolderList.filter(res => res.isSelected === true);
    let selectedPdfFile = this.filteredPdfFileList.filter(res => res.isSelected === true);

    let selectedCsvFolder = [];
    let selectedCsvFile = [];
    let csvFolderPathList: any[] = [];
    let csvFilePathList: any[] = [];
    if (this.twoStepFeatures.includes(this.selectedFeature)) {
      selectedCsvFolder = this.filteredCsvFolderList.filter(res => res.isSelected === true);
      selectedCsvFile = this.filteredCsvFileList.filter(res => res.isSelected === true);

      selectedCsvFolder.map(res => csvFolderPathList.push(res.path.slice(13) + '/' + res.name))
      selectedCsvFile.map(res => csvFilePathList.push(res.path.slice(13) + '/' + res.name))
    }
    else if (this.selectedFeature === 'Image Augmentation') {
      let image = this.filteredImageFileList.filter(res => res.isSelected === true)[0];
      image ? this.featureOptions.image_path = image.path.slice(13) + '/' + image.name : this.featureOptions.image_path = '';
    }

    let pdfFolderPathList: any[] = [];
    let pdfFilePathList: any[] = [];

    selectedPdfFolder.map(res => pdfFolderPathList.push(res.path.slice(13) + '/' + res.name));
    selectedPdfFile.map(res => pdfFilePathList.push(res.path.slice(13) + '/' + res.name));

    // let pdfPathList = [...pdfFolderPathList, ...pdfFilePathList];
    let pdfPathList = this.selectedPdfPaths;
    console.log(this.selectedPdfPaths);


    // .map(res => {
    //   let basePath = res.split('/')[0];
    //   if (basePath === 'Input_Folder') {
    //     return res.slice(13);
    //   } else {
    //     return res.slice(8);
    //   }
    // })

    let csvPathList = [...csvFolderPathList, ...csvFilePathList];
    console.log(pdfPathList);

    // let jsonString = JSON.stringify(pdfPathList);
    // this.success(jsonString);
    if (this.selectedFeature === 'Document Classification') {
      this.featureOptions.input_paths = [selectedPdfFolder[0].path.slice(13) + '/' + selectedPdfFolder[0].name];
      this.featureOptions.pattern_file = selectedPdfFile[0].path.slice(13) + '/' + selectedPdfFile[0].name;
    }
    else if (this.selectedFeature === 'Document merge') {

      pdfPathList = this.docMergeSelectedPdf.map(res => res.path);
      console.log(pdfPathList);
    }
    else if (this.selectedFeature === 'Page Reordering') {
      console.log(pdfPathList);
    }
    this._process.getFeatureProcessData(pdfPathList, csvPathList, this.selectedFeature, this.featureOptions);
  }

  savePageReordering() {
    let selectedPdfFile = this.filteredPdfFileList.filter(res => res.isSelected === true);


    let pdfPathList = [selectedPdfFile[0].path + '/' + selectedPdfFile[0].name];
    this.featureOptions.order_list = this.pdfpagenums;
    console.log(pdfPathList, this.featureOptions.order_list);

    this._process.getFeatureProcessData(pdfPathList, [], this.selectedFeature, this.featureOptions);
  }
  // ***********************************Processing When User Click On Process Button*******************************


  // ***********************************OnClick Step One,Two,Three Button Hide/Show Directory*******************************
  showPdfDirectory() {
    this.selectedStep = 'step1';
    this.showAllPdfFoldersFiles = true;
    this.showPdfFolder = true;
    this.showPdfFile = true;
    this.showAllCsvFoldersFiles = false;
  }
  showCsvDirectory() {
    this.selectedStep = 'step2';
    this.showAllPdfFoldersFiles = false;
    this.showAllCsvFoldersFiles = true;
  }
  showOptions() {
    this.selectedStep = 'step3';
    this.showAllPdfFoldersFiles = false;
    this.showAllCsvFoldersFiles = false;
  }
  showDocClassificationPdfFolder() {
    this.selectedStep = 'step1';
    this.showAllPdfFoldersFiles = true;
    this.showPdfFolder = true;
    this.showPdfFile = false;
    this.showAllCsvFoldersFiles = false;
  }
  showDocClassificationPdfFile() {
    this.selectedStep = 'step4';
    this.showAllPdfFoldersFiles = true;
    this.showPdfFolder = false;
    this.showPdfFile = true;
    this.showAllCsvFoldersFiles = false;
  }
  // ***********************************OnClick Step One,Two,Three Button Hide/Show Directory*******************************


  // ***********************************Upload Directory*******************************
  checkUploadInprogress() {
    console.log(this._upload.isUploadProcessing);

    if (this._upload.isUploadProcessing === true) {
      this._modal.showMsg('Upload in progress, please wait.', 'Not Allowed', 'info');
    }
  }
  uploadFiles(event: any) {

    if (this.base_path !== "Input_Folder/") {
      this._modal.showMsg('Upload Only allowed in MyFiles', 'Not allowed', 'info');
      return;
    }

    let files = event.target.files;

    if (files.length > 1000) {
      this._modal.showMsg('Upload is limited to 1000 files', 'Upload Limit', 'info');
      return;
    }

    if (this.pathList.length > 0) {
      this._upload.getFileSystemClient(this.pathList.join('/'));
    } else {
      this._upload.getFileSystemClient();
    }

    console.log("tt", this.pathList.join('/'));

    this._upload.uploadFiles(files);
  }

  uploadInterval: any;
  async uploadFromLink() {
    if (this.inputLinkForm.value.projectName.trim() == '') {
      this.inputLinkForm.value['projectName'] = this.inputLinkForm.value.projectName.trim();
    }
    console.log("upload form", this.inputLinkForm.value);
    if (this.inputLinkForm.valid) {
      let isFolderCreated = await this.createFolder(this.inputLinkForm.value.folderName)
      if (isFolderCreated) {
        this._directory.uploadFromLink(this.inputLinkForm.value).subscribe(res => {
          this._modal.showMsg('Documents in these links are being accesses by DocuExpert for processing', 'Success!', "success");
          this.showUploadDrive = false;
          this.listDirectories();

          localStorage.setItem('folder_name', this.inputLinkForm.value.folderName);

          // let isDocumentPresent = this.inputLinkForm.value.links.some((res:any) => {
          //   return res.name === 'DOCUMENT';
          // });

          let uidList: string[] = [];
          this.inputLinkForm.value.links.forEach((res: any) => {
            uidList.push(res.uid);
          });

          localStorage.setItem('uidList', JSON.stringify(uidList));
          console.log(uidList);

          this._common.showVUploadModal = true;
          this.uploadInterval = setInterval(() => {
            this._directory.vuploadProgress().subscribe((res: any) => {
              // console.log(res);
              this._common.vuploadProgress = res.res_data;

              if (res.res_data == 100) {
                clearInterval(this.uploadInterval);
                this._common.vuploadComplete = true;
                // this._modal.showFeatureProcessSuccess("Upload completed successfully");
              }
            });

            this._directory.vstatusProgress().subscribe((res: any) => {
              this._common.vdocumentProgress = res.res_data;
            })
          }, 5000);

        })
      } else {
        // this._modal.showMsg('Failed to create folder', 'Error', "error");
      }
    } else {
      this._modal.showMsg('Please all required fields correctly', 'Error', 'error');
      this.inputLinkForm.markAllAsTouched();
    }
  }
  // ***********************************Upload Directory*******************************

  // Directory Properties ====================================================
  getDirectoryMetadata(directory: any) {
    console.log("working");

    this._directory.getDirectoryMetadata(directory).subscribe(res => {
      this.directoryMetadataKeys = Object.keys(res.res_data);

      console.log(res.res_data);

      // this.directoryMetadataKeys.forEach(element => {
      //   if (element.includes('Date')) {
      //     res.res_data[element] = new Date(res.res_data[element]);
      //     console.log(res.res_data[element]);
      //   }
      // });
      this.directoryMetadata = res.res_data;
    });
  }
  // Directory Properties ====================================================


  // All Feature Option, get values from feature options ====================================================
  getSearchKeywords(target: any) {
    this.featureOptions.word_list = target.value.trim() ? target.value.trim().split(',') : [];

    if (this.featureOptions.word_list.length > 0) {
      this.showCsvFolder = false;
      this.showCsvFile = false;
    } else {
      this.showCsvFolder = true;
      this.showCsvFile = true;
    }
  }
  // All Feature Option, get values from feature options ====================================================


  // Delete Directory ====================================================
  async deleteDirectories() {
    // if (this.base_path !== "Input_Folder/") {
    //   this._modal.showMsg('Delete only allowed in myfiles', 'Not allowed', 'info');
    //   return;
    // }

    let showBible = this.pathList.some(path => {
      return path.includes('Delivery Bible');
    });

    if (showBible) {
      this._common.$deleteBible.next(true);
      return;
    }

    let deleteFolderList = this.filteredFolderList.filter(res => res.isSelected === true);
    let deleteGFolderList = this.gfilteredFolderList.filter(res => res.isSelected === true);
    let deleteFileList = this.filteredFileList.filter(res => res.isSelected === true);

    let folderPathList: any[] = [];
    let filePathList: any[] = [];

    deleteFolderList.map(res => folderPathList.push(res.path + '/' + res.name));
    deleteGFolderList.map(res => folderPathList.push(res.path + '/' + res.name));
    deleteFileList.map(res => filePathList.push(res.path + '/' + res.name));

    let deletePathList = [...folderPathList, ...filePathList];

    if (deletePathList.length <= 0) {
      this._modal.showMsg("No File Selected To Delete", "Error!", "error");
      return;
    }

    this._directory.delete(deletePathList, this.base_path).subscribe(res => {
      this.unselectAllFoldersAndFiles();
      this.unselectAllGFolders();
      this.listDirectories();
      this._modal.showMsg(res.res_str, "Deleted!", "success");
      console.log(res);
    })
  }
  // Delete Directory ====================================================


  // Combined Search ====================================================
  toggleAdvSearchForm() {
    if (this.selectedFeature) {
      this._modal.showMsg("Advanced Search Not Available If You Selected Feature", "Info!", "info");
      return;
    } else {
      this.showCombinedSearch = true;
    }
  }

  hideAdvSearchForm() {
    if (this.advancedSearchType === 'Folder') {
      this.contentCheck = false;
      this.metadataCheck = false;
    }
  }

  hideContentMetaOnOtherRoutes() {
    this.contentCheck = false;
    this.metadataCheck = false;
  }

  validateForm(form: string) {
    return this.contentSearchForm.get(form)?.errors && this.contentSearchForm.get(form)?.touched
  }

  validateDirSearchForm(form: string) {
    return this.documentFolderSearchForm.get(form)?.errors && this.documentFolderSearchForm.get(form)?.touched
  }

  getForms() {
    //@ts-ignore
    return this.metadataSearchForm.get('formsArray').controls;
  }

  getContentTextConditionForms() {
    //@ts-ignore
    return this.contentSearchForm.get('textConditions').controls;
  }

  getContentNumberConditionForms() {
    //@ts-ignore
    return this.contentSearchForm.get('numberConditions').controls;
  }

  getContentDateConditionForms() {
    //@ts-ignore
    return this.contentSearchForm.get('dateConditions').controls;
  }

  addContentTextForm() {
    //@ts-ignore
    this.contentSearchForm.get('textConditions').push(this._fb.group({
      search_string: ['', Validators.required],
      condition: ['contains'],
      operator: ['AND'],
      value_type: ['text']
    }));
  }

  addContentNumberForm() {
    //@ts-ignore
    this.contentSearchForm.get('numberConditions').push(this._fb.group({
      search_value: [''],
      condition: ['gt'],
      operator: ['AND'],
      start: [''],
      end: ['']
    }));
  }

  addContentDateForm() {
    //@ts-ignore
    this.contentSearchForm.get('dateConditions').push(this._fb.group({
      search_date: [''],
      condition: ['gt'],
      operator: ['AND'],
      start: [''],
      end: ['']
    }));
  }

  removeContentTextForm(index: any) {
    //@ts-ignore
    this.contentSearchForm.get('textConditions').removeAt(index);
  }

  removeContentNumberForm(index: any) {
    //@ts-ignore
    this.contentSearchForm.get('numberConditions').removeAt(index);
  }

  removeContentDateForm(index: any) {
    //@ts-ignore
    this.contentSearchForm.get('dateConditions').removeAt(index);
  }

  test() {
    console.log(this.contentSearchForm.value);
  }

  getSelectFieldData(form: string) {
    if (this.integerArr.includes(form)) {
      return this.conditionIntegerList
    }
    else if (this.boolArr.includes(form)) {
      return this.conditionBooleanList
    }
    else {
      return this.conditionStringList
    }
  }

  addRangeValue(value1: any, value2: any, index: any) {
    let range = [value1, value2]
    console.log(range);

    //@ts-ignore
    this.metadataSearchForm.get('formsArray').controls[index].value.value = range;
  }

  createForms(): FormGroup[] {
    let forms = [];
    for (let i = 0; i < this.formsList.length; i++) {
      forms.push(this._fb.group({
        formName: [this.formsList[i].name],
        logical_op: [''],
        value: ['']
      }));
      this.combineOp.push('');
    }
    return forms;
  }

  checkMetadataValue(index?: number) {

    //@ts-ignore
    index && (this.metadataSearchForm.get('formsArray').controls[index].value.logical_op === 'range') ? this.metadataSearchForm.get('formsArray').controls[index].value.value = ['', ''] : '';

    this.metadataSearchForm.value.formsArray.forEach((element: any, index: any) => {
      if (element.logical_op !== '') {
        if (element.logical_op !== 'range') {
          element.value ? this.metadataSearchData[this.formsList[index].name] = element : delete this.metadataSearchData[this.formsList[index].name];
        } else {
          element.value[0] && element.value[1] ? this.metadataSearchData[this.formsList[index].name] = element : delete this.metadataSearchData[this.formsList[index].name];
        }
      } else {
        delete this.metadataSearchData[this.formsList[index].name]
      }
    });
    console.log(this.metadataSearchData);
    this.metadataSearchKeys = Object.keys(this.metadataSearchData);
  }

  getOp(formname: string) {
    let formIndex = this.formsList.findIndex(res => res.name === formname);
    return this.combineOp[formIndex];
  }

  removeMetadataForm(formname: string) {
    delete this.metadataSearchData[formname];
    this.metadataSearchKeys = Object.keys(this.metadataSearchData);
  }

  removeAllMetadataForm() {
    this.metadataSearchData = {};
    this.metadataSearchKeys = [];
    this.combineOp = [];
    //@ts-ignore
    this.metadataSearchForm.get('formsArray').controls.forEach((element: any, i) => {
      element.reset();
      element.patchValue({
        formName: this.formsList[i].name,
        logical_op: '',
        value: ''
      });
      this.combineOp.push('');
    });
  }

  combinedSearch() {
    if (this.contentCheck && this.documentFolderCheck && this.metadataCheck) {

      if (this.contentSearchForm.invalid || this.documentFolderSearchForm.invalid) {
        this._modal.showError('Please Fill All Fields');
        this.contentSearchForm.markAllAsTouched();
        this.documentFolderSearchForm.markAllAsTouched();
        return;
      }
      this.metadataSeach();
    }
    else if (this.contentCheck && this.documentFolderCheck) {

      if (this.contentSearchForm.invalid || this.documentFolderSearchForm.invalid) {
        this._modal.showError('Please Fill All Fields');
        this.contentSearchForm.markAllAsTouched();
        this.documentFolderSearchForm.markAllAsTouched();
        return;
      }

      let combineSearchData = { content_search: this.contentSearchForm.value, file_folder_search: this.documentFolderSearchForm.value };

      let pdfFolderPathList = this.getSelectedFolderPath();
      console.log("LLLLLLLLLLLL", pdfFolderPathList)


      this.processCombinedSearch(combineSearchData, pdfFolderPathList);
    }
    else if (this.contentCheck && this.metadataCheck) {
      if (this.contentSearchForm.invalid) {
        this._modal.showError('Please Fill All Fields');
        this.contentSearchForm.markAllAsTouched();
        return;
      }
      this.metadataSeach('content&metadata');
    }
    else if (this.documentFolderCheck && this.metadataCheck) {
      console.log("fired");

      if (this.documentFolderSearchForm.invalid) {
        this._modal.showError('Please Fill All Fields');
        this.contentSearchForm.markAllAsTouched();
        return;
      }
      this.metadataSeach('document&metadata');
    }
    else if (this.contentCheck) {
      if (this.contentSearchForm.invalid) {
        this._modal.showError('Please Fill All Fields');
        this.contentSearchForm.markAllAsTouched();
        return;
      }

      let combineSearchData = { content_search: this.contentSearchForm.value };

      let pdfFolderPathList = this.getSelectedFolderPath();
      console.log("LLLLLLLLLLLL", pdfFolderPathList)


      this.processCombinedSearch(combineSearchData, pdfFolderPathList);

    }
    else if (this.documentFolderCheck) {
      if (this.documentFolderSearchForm.invalid) {
        this._modal.showError('Please Fill All Fields');
        this.documentFolderSearchForm.markAllAsTouched();
        return;
      }

      let combineSearchData = { file_folder_search: this.documentFolderSearchForm.value };

      let pdfFolderPathList = this.getSelectedFolderPath();
      console.log("LLLLLLLLLLLL", pdfFolderPathList)


      if (this.advancedSearchType === 'File') {
        this.processCombinedSearch(combineSearchData, pdfFolderPathList);
      } else {
        this.processFolderSearch(this.documentFolderSearchForm.value, pdfFolderPathList);
      }
    }
    else if (this.metadataCheck) {
      this.metadataSeach('metadata');
    }
  }

  processCombinedSearch(combineSearchData: any, pdfFolderPathList: any[]) {
    let advParent = localStorage.getItem('advParent')
    let dir_path = this._auth.org_name + '/' + this._auth.user_name;
    let parent_dir

    if (this.base_path.replace('/', '').trim().toString() == 'Input_Folder') {
      if (dir_path == pdfFolderPathList[0]) {
        parent_dir = 'Comnbine'
      } else {
        parent_dir = advParent
      }
    } else {
      parent_dir = this.base_path.replace('/', '').trim().toString()
    }
    console.log("LLLLLLprocessCombinedSearchadvParent", parent_dir)


    this._directory.combinedSearch(combineSearchData, pdfFolderPathList, parent_dir).subscribe((res: any) => {
      this.unselectAllFoldersAndFiles();
      localStorage.setItem('feature', "Advance File Search");
      localStorage.setItem('request_id', res.res_data.request_id);
      this._common.$featureProgressStart.next('');

      this._modal.showMsg(res.res_str, "Success!", "success");
      this.resetCombinedSearchFields();
    }, (err: any) => { this.deleteExtraParamsMetadata(); });
  }

  processFolderSearch(searchData: any, pdfFolderPathList: any[]) {
    this._directory.folderSearch(searchData, pdfFolderPathList, this.base_path).subscribe((res: any) => {
      this.unselectAllFoldersAndFiles();
      localStorage.setItem('feature', "Advance Folder Search");
      localStorage.setItem('request_id', res.res_data.request_id);
      this._common.$featureProgressStart.next('');

      this._modal.showMsg(res.res_str, "Success!", "success");
      this.resetCombinedSearchFields();
    });
  }

  metadataSeach(type: string = 'metadataall') {
    if (this.metadataSearchKeys.length === 0) {
      this._modal.showError('Please Fill Atleast One Metadata Field');
      return;
    }

    let combineop: any[] = this.getCombineOp();

    let metadataSize = this.metadataSearchKeys.length;
    let combineOpSize = combineop.length;

    if (combineOpSize === (metadataSize - 1)) {
      this.deleteExtraParamsMetadata();
      let combineSearchData = type === 'metadataall' ? { content_search: this.contentSearchForm.value, file_folder_search: this.documentFolderSearchForm.value, metadata_search: { search_metadata: this.metadataSearchData }, condition_combine_operators: combineop } : type === 'content&metadata' ? { content_search: this.contentSearchForm.value, metadata_search: { search_metadata: this.metadataSearchData }, condition_combine_operators: combineop } : type === 'metadata' ? { metadata_search: { search_metadata: this.metadataSearchData }, condition_combine_operators: combineop } : { file_folder_search: this.documentFolderSearchForm.value, metadata_search: { search_metadata: this.metadataSearchData }, condition_combine_operators: combineop };

      let pdfFolderPathList = this.getSelectedFolderPath();
      console.log("LLLLLLLLLLLL", pdfFolderPathList)

      this.processCombinedSearch(combineSearchData, pdfFolderPathList);
    } else {
      this._modal.showError('Combine Operator should be equal to total no of fields - 1');
      return;
    }
  }

  getCombineOp() {
    let combineop: any[] = [];

    this.metadataSearchKeys.forEach((element: any) => {
      let formIndex = this.formsList.findIndex(res => res.name === element);
      combineop.push(this.combineOp[formIndex]);
    });

    combineop = this.combineOp.filter(res => res !== '');

    return combineop;
  }

  deleteExtraParamsMetadata() {
    this.metadataSearchKeys.forEach((element: any) => {
      delete this.metadataSearchData[element]['formName'];
    });
  }

  getSelectedFolderPath() {
    let folderPathList: any[] = [];

    let dir_path = this._auth.org_name + '/' + this._auth.user_name;
    if (this.pathList.length > 0) {
      dir_path = dir_path + '/' + this.pathList.join('/');
    }

    folderPathList.push(dir_path);

    return folderPathList;
  }

  resetCombinedSearchFields() {
    this.contentSearchForm.reset();
    this.documentFolderSearchForm.reset();
    this.removeAllMetadataForm();

    this.contentSearchForm.patchValue({
      text: false,
      number: false,
      date: false,
      approx_search: false,
      textOperator: 'AND',
      numberOperator: 'AND'
    });

    //@ts-ignore
    this.contentSearchForm.get('textConditions').clear();
    //@ts-ignore
    this.contentSearchForm.get('numberConditions').clear();
    //@ts-ignore
    this.contentSearchForm.get('dateConditions').clear();

    this.addContentTextForm();
    this.addContentNumberForm();
    this.addContentDateForm();

    this.documentFolderSearchForm.patchValue({
      search_rule: '',
      is_pattern: 'false',
      fixed_left: '',
      fixed_right: ''
    });
  }

  resetMetadataForm(index: number) {
    //@ts-ignore
    this.metadataSearchForm.get('formsArray').controls[index].reset();
    //@ts-ignore
    this.metadataSearchForm.get('formsArray').controls[index].patchValue({
      formName: this.formsList[index].name,
      logical_op: '',
      value: ''
    });
    this.combineOp[index] = '';
  }
  // Combined Search ====================================================


  // Upload from Link
  async loginWithGoogle() {
    this._directory.loginWithGoogle().subscribe((res: any) => {
      console.log(res);
      window.location.href = res.res_str;
    });
    // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  // Upload from Link



  // ***********************************All Modals*******************************
  createFolderModal() {
    if (this.base_path !== "Input_Folder/") {
      this._modal.showMsg('Only allowed in MyFiles', 'Not allowed', 'info');
      return;
    }

    Swal.fire({
      title: 'Please Enter your Folder Name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        maxlength: '255'
      },
      // html:'<div style="text-align:left;"><ul  style="padding-left:20px;font-size:16px;"><li>must be uppercase</li><li>must be uppercase</li></ul></div>',
      backdrop: true,
      showCancelButton: true,
      confirmButtonText: 'Create Folder',
      showLoaderOnConfirm: true,
      preConfirm: async (folderName) => {
        console.log(folderName, this.allFolderNames);
        folderName = folderName.trim();
        if (!folderName) {
          Swal.showValidationMessage("please give proper value")
        }
        else if (folderName && folderName.includes('.')) {
          Swal.showValidationMessage("should not contain dot(.)")
        }
        else if (folderName && folderName.includes(' ')) {
          Swal.showValidationMessage("should not contain any space")
        }
        else if (this.allFileNames.includes(folderName)) {
          Swal.showValidationMessage("file with same name exists")
        }
        else if (this.allFolderNames.includes(folderName)) {
          Swal.showValidationMessage("folder with same name exists");
        }
        else {
          // let fileSystemClient: DataLakeFileSystemClient = null;
          // if (this.pathList.length > 0) {
          //   fileSystemClient = this._upload.getFileSystemClient(this.pathList.join('/'));
          // } else {
          //   fileSystemClient = this._upload.getFileSystemClient();
          // }
          // const directoryClient: DataLakeDirectoryClient = fileSystemClient.getDirectoryClient(folderName);
          // let createdFolder = await directoryClient.create();
          // if (createdFolder) {
          //   this.listDirectories();
          // }
          this._directory.createFolder(this.pathList.join('/'), folderName).subscribe(res => {
            this.listDirectories();
          });
        }
      },
      allowOutsideClick: () => false
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: `${result.value} Folder Created Successfully`,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }
  // ***********************************All Modals*******************************


  // ***********************************upload link*******************************
  get inputLinks(): FormArray {
    return this.inputLinkForm.get("links") as FormArray;
  }

  addInputLinks() {
    this.inputLinks.push(this._fb.group({
      input_link: ['', Validators.required],
      name: ['', Validators.required],
      uid: [this._common.getRandomString()]
    }));
  }

  removeInputLinks(i: number) {
    this.inputLinks.removeAt(i);
  }

  uploadLinkLogout() {
    this._directory.uploadLinkLogout().subscribe(res => {
      this.isLoggedIn = false;
    })
  }

  uploadLinkLoggedIn() {
    this._directory.isLoggedIn().subscribe((res: any) => {
      this.isLoggedIn = res.res_data;
      this.showUploadDrive = true;
    })
  }

  uploadLinkValidation(i: number, name: string) {
    //@ts-ignore
    return this.inputLinks.controls[i].controls[name].errors && this.inputLinks.controls[i].controls[name].touched;
  }

  checkSelection(type: string): boolean {
    let isDocumentPresent = this.inputLinkForm.value.links.some((res: any) => {
      return res.name === type;
    });

    return isDocumentPresent;
  }
  // ***********************************upload link*******************************

  //create Folder
  async createFolder(folderName: string): Promise<boolean> {
    if (!folderName) {
      this._modal.showMsg("please give proper value", 'Error', 'error')
      return false;
    }
    else if (folderName && folderName.includes('.')) {
      this._modal.showMsg("should not contain dot(.)", 'Error', 'error');
      return false;
    }
    else if (folderName && folderName.includes(' ')) {
      this._modal.showMsg("should not contain any space", 'Error', 'error');
      return false;
    }
    else if (this.allFileNames.includes(folderName)) {
      this._modal.showMsg("file with same name exists", 'Error', 'error');
      return false;
    }
    // else if (this.allFolderNames.includes(folderName)) {
    //   this._modal.showMsg("folder with same name exists", 'Error', 'error');
    //   return false;
    // }
    else {
      let fileSystemClient: DataLakeFileSystemClient = null;
      if (this.pathList.length > 0) {
        fileSystemClient = this._upload.getFileSystemClient(this.pathList.join('/'), "docuexpertuat2/G_input/");
      } else {
        fileSystemClient = this._upload.getFileSystemClient("", "docuexpertuat2/G_input/");
      }
      const directoryClient: DataLakeDirectoryClient = fileSystemClient.getDirectoryClient(folderName.trim());
      let createdFolder = await directoryClient.create();
      if (createdFolder) {
        return true;
      } else {
        return false;
      }
    }
  }
  //create Folder

  //Document merge=====================================================================
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    console.log(event.container.data);

    event.container.data.forEach((res: any, index: number) => {
      if (!this.docMergePdf.includes(res)) {
        res.isSelected = true;
        this.docMergePdf.splice(index, 0, res);
      }
    });
  }

  getFileNameBeforeDrop(item: string) {
    let pathArr = item.split('/');
    return pathArr[pathArr.length - 1];
  }

  getFileNameAfterDrop(item: string) {
    // let path = this.base_path + this._auth.org_name + '/' + this._auth.user_name;
    // return item.slice(path.length+1);
    return item.split('/').pop();
  }

  selectItem(item: any) {
    this.docMergeSelectedPdf.push(item);
  }

  selectedItemColor(res: any) {
    return this.docMergeSelectedPdf.includes(res);
  }

  removeItem(i: number) {
    let itemIndex = this.docMergePdf.findIndex((res: any) => {
      return res.path === this.docMergeSelectedPdf[i].path;
    });

    this.docMergeSelectedPdf.splice(i, 1);

    this.docMergePdf[itemIndex].isSelected = false;
  }

  noReturnPredicate() {
    return false;
  }
  //Document merge=====================================================================

  // Page Reordering===================================================================
  pdfNumPagedrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pdfpagenums, event.previousIndex, event.currentIndex);
  }

  readPdfFromServer(path: any) {

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
          if (res['body']['res_data']) {
            this.pdfpagenums = [];
            for (let i = 0; i < parseInt(res.body.res_data.totalcount); i++) {
              console.log(i);

              this.pdfpagenums.push(i + 1);
            }

            this.readPdf(res['body']['res_data']['encoded_string']);
          }
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
    let url = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);

    this.pdfurl = url;
  }
  // Page Reordering===================================================================

  ngOnDestroy(): void {
    this._common.$featureName.next('');
  }
  // show tree view on selected folder
  showTreeViewofFolder(val: any) {
    // let arr=val.slice(3).split('/')

    console.log("folder selected>>single click", val)
    this.selectedFileForQuestion = val.name
    if (val.is_directory) {
      this._common.$selectedFolderData.next({});
      let rootDir = {}
      rootDir = {
        "name": val.name,
        "id": 0,
        "path": val.path + "/" + val.name,
        "total_count": val.total_dirs + val.total_files,
        "type": "directory",
        "expanded": false,
      }
      this._common.$selectedFolderData.next(rootDir);
      // this._common.$showFolderTree.next(true);
      // this._common.$showFeatureList.next(false);
      // this._common.$showTree.next(false)

      this.selectsingleFolder(val.name, val.path)
    } else {
      this.selectsingleFile(val.name)
    }

  }

  selectsingleFolder(dirName: string, dirPath: string) {
    let dirPathName = dirPath.split('/')[0];
    if (dirPathName === 'G_input') {
      let dirIndex = this.gfilteredFolderList.findIndex(res => res.name === dirName);
      for (let i = 0; i < this.gfilteredFolderList.length; i++) {
        if (i == dirIndex) {
          this.gfilteredFolderList[i].isSelectedSingle = true;
        } else {
          this.gfilteredFolderList[i].isSelectedSingle = false;
        }
        for (let i = 0; i < this.filteredFolderList.length; i++) {
          this.filteredFolderList[i].isSelectedSingle = false;
        }
        for (let i = 0; i < this.filteredFileList.length; i++) {
          this.filteredFileList[i].isSelectedSingle = false;
        }
      }
    } else {
      let dirIndex = this.filteredFolderList.findIndex(res => res.name === dirName);
      for (let i = 0; i < this.filteredFolderList.length; i++) {
        if (i == dirIndex) {
          this.filteredFolderList[i].isSelectedSingle = true;
        } else {
          this.filteredFolderList[i].isSelectedSingle = false;
        }
        for (let i = 0; i < this.gfilteredFolderList.length; i++) {
          this.gfilteredFolderList[i].isSelectedSingle = false;
        }
        for (let i = 0; i < this.filteredFileList.length; i++) {
          this.filteredFileList[i].isSelectedSingle = false;
        }
      }
    }
  }

  selectsingleFile(dirName: string) {
    let dirIndex = this.filteredFileList.findIndex(res => res.name === dirName);
    for (let i = 0; i < this.filteredFileList.length; i++) {
      if (i == dirIndex) {
        this.filteredFileList[i].isSelectedSingle = true;
      } else {
        this.filteredFileList[i].isSelectedSingle = false;
      }
      for (let i = 0; i < this.filteredFolderList.length; i++) {
        this.filteredFolderList[i].isSelectedSingle = false;
      }
      for (let i = 0; i < this.gfilteredFolderList.length; i++) {
        this.gfilteredFolderList[i].isSelectedSingle = false;
      }
    }
  }

  // ------------------------- Context menue-------------------------------------------

  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, item: any) {
    console.log("in mouse up event", event, item)
    event.preventDefault();
    const button = document.getElementById(item.name);
    console.log(button)
    document.getElementById(item.name).click()
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    console.log(this.contextMenuPosition.x, this.contextMenuPosition.y)
    // this.contextMenu.menuData = { 'item': item };
    // this.contextMenu.menu.focusFirstItem('mouse');
    // this.contextMenu.openMenu();
  }

  onContextMenuAction1(item: any) {
    alert(`Click on Action 1 for ${item}`);
  }

  onContextMenuAction2(item: any) {
    alert(`Click on Action 2 for ${item}`);
  }

  verifyFunc(res: string) {
    let operation: any
    if (res == "verify") {
      operation = 1
    } else if (res == "not-verify") {
      operation = 0
    } else if (res == "tbd") {
      operation = 2
    }
    this._common.$varifyFolder.next('')
    let showBible = this.pathList.some(path => {
      return path.includes('Delivery Bible');
    });

    if (showBible && this.pathList[this.pathList.length - 1].includes("Delivery Bible")) {
      this._common.$varifyFolder.next(res)
      return;
    }
    let downloadFolderList = this.filteredFolderList.filter(res => res.isSelected === true);
    let downloadFileList = this.filteredFileList.filter(res => res.isSelected === true);

    let folderPathList: any[] = [];
    let filePathList: any[] = [];

    downloadFolderList.map(res => folderPathList.push(res.name));
    downloadFileList.map(res => filePathList.push(res.name));

    // downloadFolderList.map(res => folderPathList.push(res.path+ '/' + res.name));
    // downloadFileList.map(res => filePathList.push(res.path + '/' + res.name));

    let downloadPathList = [...folderPathList, ...filePathList];

    if (downloadPathList.length <= 0) {
      this._modal.showMsg("No file is selected", "Error!", "error");
      return;
    }

    let dir_path = this.base_path + this._auth.org_name + '/' + this._auth.user_name;

    let path = dir_path + "/" + this.pathList.join("/")
    let projpath = path.substring(0, path.indexOf('/output'));
    console.log("???????>>>", downloadPathList,)
    console.log("???????>>>", downloadPathList, projpath)
    console.log("???????>>>", downloadPathList, path)
    this.verifyFuncAPI(path, projpath, operation, downloadPathList)
  }

  verifyFuncAPI(fullpath: string, projPath: string, operation: any, folderlist: any) {

    // let ind= x.indexOf('output');
    // var result =  x.substring(0, remove_after);
    let formData = new FormData;

    // formData.append("dir_path", path);
    // formData.append("dir_path_g", gpath);
    formData.append("user_id", this._auth.user_id);
    formData.append("proj_folder", JSON.stringify(folderlist));
    formData.append("projectpath", projPath);
    formData.append("is_operation", operation);
    formData.append("full_path", fullpath)


    this.httpClient.post('/delivery_bible/proj_approve/', formData).subscribe((res: any) => {
      console.log("varify res is ", res)
      this._common.$varifyFolder.next('')
      setTimeout(() => {
        this._modal.showVarifyPopup(res.res_str);
      }, 1000);
      // this.ngOnInit()
      this.listDirectories()
    });
  }

  openList() {
    // formData.append("user_id", this._auth.user_id);
    // this.showOption=true 
    let dir_path = this.base_path + this._auth.org_name + '/' + this._auth.user_name;
    // let path=this.pathList
    let fname = this.pathList[this.pathList.length - 1]
    let path2 = this.pathList.join("/")
    let sub = path2.substring(0, path2.indexOf('/output'));
    let subPath = dir_path + "/" + sub
    // console.log("?????????",this.pathList,dir_path,this.selectedFileForQuestion,this.pathList[this.pathList.length-1])
    console.log("new path", sub, subPath, this.selectedFileForQuestion, fname)
    this.getQuery(subPath, this.selectedFileForQuestion, fname).subscribe((res: any) => {
      console.log("resssssssss", res.res_data.Query)
      this.varifyQuestionList = res.res_data.Query
      let varifycount = 0
      let cancelcount = 0
      let tbdcount = 0

      this.varifyQuestionList.map((res: any) => {
        if (res.question == null) {
          res.question = ""
        }
        if (res.response == null) {
          res.response = ""
        }
        if (res.note == null) {
          res.note = ""
        }
        if (res.response == 'varified') {
          varifycount = varifycount + 1
        } else if (res.response == 'cancel') {
          cancelcount = varifycount + 1
        } else if (res.response == 'tbd') {
          tbdcount = varifycount + 1
        }
      })
      if (varifycount == this.varifyQuestionList.length) {
        this.selectAllQues = 'varified'
      } else if (cancelcount == this.varifyQuestionList.length) {
        this.selectAllQues = 'cancel'
      } else if (tbdcount == this.varifyQuestionList.length) {
        this.selectAllQues = 'tbd'
      }
      this.showQuestionList = true
    })
  }

  submitQuery() {
    let dir_path = this.base_path + this._auth.org_name + '/' + this._auth.user_name;
    console.log("path is", this.pathList)
    let fname = this.pathList[this.pathList.length - 1]
    let path2 = this.pathList.join("/")
    let sub = path2.substring(0, path2.indexOf('/output'));
    let subPath = dir_path + "/" + sub
    // console.log("?????????",this.pathList,dir_path,this.selectedFileForQuestion,this.pathList[this.pathList.length-1])
    console.log("new path", subPath, this.selectedFileForQuestion, fname)
    this.submitQueryForValidation(subPath, this.selectedFileForQuestion, fname).subscribe((res: any) => {
      console.log("resssssssss", res)
      this.showQuestionList = false
      this._modal.showFeatureProcessSuccess(res.res_str);
    })
  }

  getQuery(path: string, filename: string, folder: string) {
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("file_name", filename);
    formData.append("folder_name", folder);
    formData.append("projectpath", path);
    return this.httpClient.post('/delivery_bible/fatch_query/', formData);

  }

  submitQueryForValidation(path: string, filename: string, folder: string) {
    console.log("inside submit")
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("file_name", filename);
    formData.append("folder_name", folder);
    formData.append("projectpath", path);
    formData.append("query_set", JSON.stringify(this.varifyQuestionList))
    return this.httpClient.post('/delivery_bible/add_query/', formData);
  }

  setselectAllQues() {
    setTimeout(() => {
      console.log("?????????", this.selectAllQues)
      this.varifyQuestionList.map((res: any) => res.response = this.selectAllQues)
      console.log(this.varifyQuestionList);
    });
  }
  undoFunc() {
    setTimeout(() => {
      console.log("?????????", this.selectAllQues)
      this.selectAllQues = ""
      this.varifyQuestionList.map((res: any) => {
        res.response = "";
        res.note = ""
      }
      )
      console.log(this.varifyQuestionList);
    });
  }
  // getQuesToSub(obj:any){

  //   return removeEmpty
  // }
  // showBilble file movement
  showFileMovement() {
    this.showFilesMove = !this.showFilesMove
    if (this.showFilesMove) {
      this.showBuildDeliveryUi2 = true
      this.showFetchDirSpinner = false;
      console.log(">>>>>>>path list", this.pathList)
      return
    } else {
      this.showBuildDeliveryUi2 = false
    }
    // this.openDirectory();
    // this.listDirectories();
    console.log("nbjhbjhbhb", this.showFilesMove)
    // this._common.$showFileMov.next(this.showFilesMove)
  }

  // add or remove tags
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tagList.push({ name: value });
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: any): void {
    const index = this.tagList.indexOf(tag);

    if (index >= 0) {
      this.tagList.splice(index, 1);
    }
  }

  filecombinedSearch() {
    if (this.contentSearchForm.invalid) {
      this._modal.showError('Please Fill All Fields');
      this.contentSearchForm.markAllAsTouched();
      return;
    }

    let combineSearchData = { content_search: this.contentSearchForm.value };

    let pdfFolderPathList = this.getSelectedFolderPath();
    console.log("LLLLLLLLLLLL", pdfFolderPathList)


    this.fileCombinedSearch(combineSearchData, pdfFolderPathList);
  }

  fileCombinedSearch(data: any, path: any) {
    let setpath=this.base_path.replace('/', '').trim().toString()+"/"+path[0]
    console.log("????????//////", data,this.showFullPdfPath)
    this._directory.fileCombineSearch(data, this.showFullPdfPath).subscribe((res: any) => {
      console.log(">>>>>>>>>>", res)
      // if (res.type === HttpEventType.Response) {
      //   console.log("////////res", res)
      // if(res)
        res['res_data'] && this.readPdfright(res['res_data']['result'],'searchPdf');
      // }
    })
  }


}





// { name: "UI Design1", directory: "Folder", isSelected: false, type: "pdf" }
// { name: "UI Design", directory: "File", isSelected: false, type: "pdf" }
// { name: "Pdf UI Design", directory: "File", isSelected: false, type: "pdf", path: "subhasis/subhasis/Pdf UI Design" }

