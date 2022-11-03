import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvancedSearchService } from './services/advanced-search.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {

  formsListSelectVal: string = "";
  formTypeRadioVal: string = "Metadata";

  contentCheck: boolean = true;
  metadataCheck: boolean = false;
  documentFolderCheck: boolean = false;

  formsList: any[] = [{ name: 'FileName', unit: "" }, { name: 'Directory', unit: '' }, { name: 'FileSize', unit: '' }, { name: 'FileModificationDate_Time', unit: '' }, { name: 'FileAccessDate_Time', units: '' }, { name: 'FileInodeChangeDate_Time', unit: '' }, { name: 'FilePermissions', unit: '(eg. rwxrw-r--, r-read,  w-write, x-execute)' }, { name: 'PDFVersion', unit: '(from 1.1 to 1.7)' }, { name: 'Author', unit: '' }, { name: 'CreateDate', unit: '' }, { name: 'ModifyDate', unit: '' }, { name: 'Subject', unit: '' }, { name: 'Creator', unit: '' }, { name: 'Description', unit: '' }, { name: 'Title', unit: '' }, { name: 'CreatorTool', unit: '' }, { name: 'MetadataDate', unit: '' }, { name: 'Keywords', unit: '' }, { name: 'Producer', unit: '' }, { name: 'RenditionClass', unit: '' }, { name: 'MaxPageSizeW', units: '' }, { name: 'MaxPageSizeH', unit: '' }, { name: 'MaxPageSizeUnit', unit: '' }, { name: 'FontName', unit: '(eg. Times-Roman,Times-Bold,Courier,Courier-Bold' }, { name: 'FontFamily', unit: '("sans-serif", e.g., Helvetica)' }, { name: 'PageCount', unit: '' }, { name: 'BoundingBox', unit: '' }, { name: 'ImageHeight', unit: '(In pixels)' }, { name: 'ImageWidth', unit: '(In pixels)' }, { name: 'ImageSize', unit: '(In pixels)' }, { name: 'Megapixels', unit: '' }];
  
  // {name:'Language',unit:'(en, en-IN, en-US, en-SG, en-GB)'}, 

  addedFormsList: any[] = [];

  // All Search Forms ================================== 
  metadataSearchForm: FormGroup;
  formsArray: FormArray;

  contentSearchForm: FormGroup;
  fileFolderSearchForm: FormGroup;
  // All Search Forms ==================================

  // Select Field optins data ==============================
  conditionIntegerList: any[] = [{ label: 'isGreaterThan', value: "gt" }, { label: 'isLessThan', value: 'lt' }, { label: 'isGreaterThanOrEqualsTo', value: 'gte' }, { label: 'isLessThanOrEqualsTo', value: 'lte' }, { value: 'range', label: 'Range' }];

  conditionStringList = [{ label: 'contains', value: 'contains' }, { label: 'exact', value: 'exact' }, { label: 'iexact', value: 'iexact' }, { label: 'icontains', value: 'icontains' }, { value: 'startswith', label: 'StartsWith' }, { value: 'istartswith', label: 'IStartsWith' }, { value: 'endswith', label: 'EndsWith' }, { value: 'iendswith', label: 'IEndsWith' }];

  conditionBooleanList = [{ value: 'boolean', label: 'boolean' }];
  // Select Field optins data ==============================

  // Types Of Forms
  integerArr: any[] = ["ContainerVersion", "CreatorVersion", "FileSize", "FontVersion", "ImageHeight", "ImageSize", "ImageWidth", "MaxPageSizeH", "MaxPageSizeUnit", "MaxPageSizeW", "Megapixels", "NPages", "PageCount","FileModificationDate_Time","FileAccessDate_Time","FileInodeChangeDate_Time","CreateDate","ModifyDate","MetadataDate"]
  
  boolArr: any[] = ["Linearized"]
  // Types Of Forms

  displayedColumns = ['sno', 'file name', 'file path'];
  tableData: any[] = [];

  showTable: boolean = false;

  combineOp: any[] = []


  constructor(private _fb: FormBuilder, private _search: AdvancedSearchService) { }

  ngOnInit(): void {
    this.metadataSearchForm = this._fb.group({
      formsArray: this._fb.array([])
    });

    this.contentSearchForm = this._fb.group({
      search_string: ['', Validators.required],
      type: ['Text'],
      fixed_left: ['', Validators.required],
      fixed_right: ['', Validators.required]
    })

    this.fileFolderSearchForm = this._fb.group({
      search_string: ['', Validators.required],
      type: ['Text'],
      fixed_left: [''],
      fixed_right: [''],
      file_search: ['True']
    })
  }

  // Create and Gets Forms ============================================================
  getForms() {
    //@ts-ignore
    return this.metadataSearchForm.get('formsArray').controls;
  }

  createItem(): FormGroup {
    return this._fb.group({
      logical_op: [''],
      value: ['']
      // combineOp: ['']
      // range1: [''],
      // range2: ['']
    });
  }
  // Create and Gets Forms ============================================================
  
  // All Form Operations =========================================================================
  addForm() {
    let index = this.formsList.findIndex(res => res.name === this.formsListSelectVal);
    // this.addedFormsList.push(this.formsListSelectVal);
    this.addedFormsList.push(this.formsList[index]);
    this.formsList.splice(index, 1);

    this.formsArray = this.metadataSearchForm.get('formsArray') as FormArray;
    this.formsArray.push(this.createItem());

    //@ts-ignore
    // console.log(this.metadataSearchForm.get('formsArray').value);
    console.log(this.addedFormsList);
    
  }

  deleteForm(index: number) {
    let form = this.addedFormsList[index];
    this.addedFormsList.splice(index, 1);
    this.formsList.unshift(form);
    this.formsListSelectVal = ""

    this.formsArray = this.metadataSearchForm.get('formsArray') as FormArray;
    this.formsArray.removeAt(index)

    console.log(form);
    
  }

  validateForm(form: string) {
    return this.contentSearchForm.get(form)?.errors && this.contentSearchForm.get(form)?.touched
  }

  validateDirSearchForm(form: string) {
    return this.fileFolderSearchForm.get(form)?.errors && this.fileFolderSearchForm.get(form)?.touched
  }

  addRangeValue(value1:any,value2:any,index:any) {
    let range = [value1, value2]
    console.log(range);
    
    //@ts-ignore
    this.metadataSearchForm.get('formsArray').controls[index].value.value = range
  }

  resetValue(index:number) {
    //@ts-ignore
    // this.metadataSearchForm.get('formsArray').controls[index].value.value = "";
  }
  // All Form Operations =========================================================================

  // Onchange Content,Metadata,Document/Folder Radio Buttons ===================================
  showView() {
    this.formsListSelectVal = "";
    this.showTable = false;
  }
  // Onchange Content,Metadata,Document/Folder Radio Buttons ===================================


  // Content Search ===================================================================
  contentSearch() {
    console.log(this.contentSearchForm.value);
    
    if (this.contentSearchForm.valid) {
      this._search.getContentSearchData(this.contentSearchForm.value).subscribe(res => {
        this.tableData = res.res_data.output_docs;
        this.showTable = !this.showTable;

        console.log(this.tableData);
      })
    } else {
      this.contentSearchForm.markAllAsTouched();
    }
  }
  // Content Search ===================================================================

  // FileFolder Search ==================================================================
  doucumentFolderSearch() {
    this._search.getFileFolderSearchData(this.fileFolderSearchForm.value).subscribe(res => {
      this.tableData = res.res_data.doc_path_list;
      this.showTable = !this.showTable;

      console.log(this.tableData);
    })
  }
  // FileFolder Search ==================================================================

  // Metadata Search ===================================================================
  metadataSearch() {
    let search_data = {};
    let test = this.metadataSearchForm.value.formsArray.map((res: any, index: number) => {
      //@ts-ignore
      search_data[this.addedFormsList[index].name] = res;
    })
    console.log(search_data);
    return search_data;
    
    // this._search.getMetadataSearchData(search_data, this.combineOp).subscribe(res => {
    //   console.log(res.res_data.doc_path_list);
      

    //   this.tableData = res.res_data.doc_path_list;
    //   this.showTable = !this.showTable;
    // })
  }
  // Metadata Search ===================================================================


  // Combined Search ===================================================================
  combinedSearch() {
    // contentCheck, documentFolderCheck, metadataCheck

    if (this.contentCheck && this.documentFolderCheck && this.metadataCheck) {
      let combineSearchData = { content_search: this.contentSearchForm.value, file_folder_search: this.fileFolderSearchForm.value, metadata_search: { search_metadata: this.metadataSearch() }, condition_combine_operators: this.combineOp };
      
      
    }
    else if (this.contentCheck && this.documentFolderCheck) {

    }
    else if (this.contentCheck && this.metadataCheck) {

    }
    else if (this.documentFolderCheck && this.metadataCheck) {

    }
    else if (this.contentCheck) {

    }
    else if (this.documentFolderCheck) {

    }
    else if (this.metadataCheck) {

    }
  }
  // Combined Search ===================================================================
  

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

  searchAgain() {
    this.showTable = !this.showTable;
    this.formsListSelectVal = "";

    //@ts-ignore
    this.metadataSearchForm.controls['formsArray'].clear();
    this.formsList = [{ name: 'FileName', unit: "" }, { name: 'Directory', unit: '' }, { name: 'FileSize', unit: '' }, { name: 'FileModificationDate_Time', unit: '' }, { name: 'FileAccessDate_Time', units: '' }, { name: 'FileInodeChangeDate_Time', unit: '' }, { name: 'FilePermissions', unit: '(eg. rwxrw-r--, r-read,  w-write, x-execute)' }, { name: 'PDFVersion', unit: '(from 1.1 to 1.7)' }, { name: 'Author', unit: '' }, { name: 'CreateDate', unit: '' }, { name: 'ModifyDate', unit: '' }, { name: 'Subject', unit: '' }, { name: 'Creator', unit: '' }, { name: 'Description', unit: '' }, { name: 'Title', unit: '' }, { name: 'CreatorTool', unit: '' }, { name: 'MetadataDate', unit: '' }, { name: 'Keywords', unit: '' }, { name: 'Producer', unit: '' }, { name: 'RenditionClass', unit: '' }, { name: 'MaxPageSizeW', units: '' }, { name: 'MaxPageSizeH', unit: '' }, { name: 'MaxPageSizeUnit', unit: '' }, { name: 'FontName', unit: '(eg. Times-Roman,Times-Bold,Courier,Courier-Bold' }, { name: 'FontFamily', unit: '("sans-serif", e.g., Helvetica)' }, { name: 'PageCount', unit: '' }, { name: 'BoundingBox', unit: '' }, { name: 'ImageHeight', unit: '(In pixels)' }, { name: 'ImageWidth', unit: '(In pixels)' }, { name: 'ImageSize', unit: '(In pixels)' }, { name: 'Megapixels', unit: '' }];
    this.addedFormsList = [];
  }

}



// if content search is selected then set content search value or set as null


// this.metadataSearchForm.value.formsArray.forEach((res:any,index:number) => {
//   if (Array.isArray(res.value)) {
//     res.value[0] && res.value[1] ? this.validateMetadataForm(index,"range","remove") : this.validateMetadataForm(index,"range","add")
//   } else {
//     res.value ? this.validateMetadataForm(index,"value","remove") : this.validateMetadataForm(index,"value","add")
//   }
// });

// validateMetadataForm(index:any,type:string,op:string) {
//   if (type === "range" && op === "add") {
//     //@ts-ignore
//     console.log(this.metadataSearchForm.get('formsArray').controls[index]);
//   }
//   else if (type === "range" && op === "remove") {
    
//   }
//   else if (type === "value" && op === "add") {
    
//   }
//   else if (type === "value" && op === "remove") {

//   }
// }


// , {
  //   validator: this.validateValueField('logical_op','value','range1','range2')
  // }
  // validateValueField(logical_op: string,value: string, range1: string, range2: string) {
  //   return (formGroup: FormGroup) => {
  //     const containsControl = formGroup.controls[logical_op];
  //     const valueControl = formGroup.controls[value];
  //     const range1Control = formGroup.controls[range1];
  //     const range2Control = formGroup.controls[range2];

  //     // if ((valueControl.errors && !valueControl.errors.required) || (range1Control.errors && !range1Control.errors.required) || (range2Control.errors && !range2Control.errors.required)) {
  //     //   // return if another validator has already found an error on the matchingControl
  //     //   return;
  //     // }
      
  //     if (containsControl.value === "range") {
  //       valueControl.setErrors(null);
  //       range1Control.value ? range1Control.setErrors(null) : range1Control.setErrors({ required: true });
  //       range2Control.value ? range2Control.setErrors(null) : range2Control.setErrors({ required: true });
  //     } else {
  //       range1Control.setErrors(null);
  //       range2Control.setErrors(null);
  //       valueControl.value ? valueControl.setErrors(null) : valueControl.setErrors({ required: true });
  //     }

  //     // if (control.errors && !control.errors.required) {
  //     //   // return if another validator has already found an error on the matchingControl
  //     //   return;
  //     // }

  //     // set error on matchingControl if validation fails
  //     // if (Array.isArray(control.value)) {
  //     //   control.value[0] && control.value[1] ? control.setErrors(null) : control.setErrors({ required: true });
  //     // } else {
  //     //   // console.log(control);
  //     //   control.value ? control.setErrors(null) : control.setErrors({ required: true });
  //     // }
  //   }
  // }