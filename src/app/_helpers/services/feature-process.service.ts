import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from '../common/commonn.service';
import { ModalService } from './modal.service';

@Injectable()
export class FeatureProcessService {

  termBasedFeatures: any[] = ["Highlight Term", "Redaction Term", "Attribute Retrieval", "Delivery Bible"];
  optionFeatures: any[] = ["Image Augmentation", "Watermarking", "Encryption", "Decryption", "Metadata Deletion", "Metadata Updation", "Add Bookmarks", "Internal Linking", "Sentiment Detection", "Document Classification", "Redact Personal Information", "Content Based Grouping", "Extractive Summary", "Anchor Text Extraction", "Anchor Text Page Ordering", "Anchor Text Page Classification", "Anchor Text Document Classification", "Anchor Text Document Ordering", "Hight Based Highlight", "Split Pdf", "Page Reordering", "Document merge", "Hard time dashboard"];

  constructor(private _modal: ModalService, private _auth: AuthService, private _common: CommonnService, private http: HttpClient) { }

  public getFeatureProcessData(inputPaths: string[], dbPaths: string[], feature: string, options: any = null) {
    console.log("in process path")
    console.log(inputPaths, dbPaths, options, feature);

    if (inputPaths.length === 0) {
      this._modal.showError("Please select at least one, pdf");
      return;
    }

    let requestId = this._common.getRandomString();
    localStorage.setItem('request_id', requestId.toString());

    let formdata = new FormData();

    formdata.append('request_id', requestId);
    formdata.append('user_id', this._auth.user_id.toString());

    if (feature !== 'Document Classification') {
      formdata.append('input_paths', JSON.stringify(inputPaths));
    }

    if (this.termBasedFeatures.includes(feature)) {
      console.log("////",feature)
      this.highlightRedactTerm(formdata, dbPaths, feature, options);
    }
    else if (this.optionFeatures.includes(feature)) {
      localStorage.setItem('feature', feature);
      this.singleStepFeatureWithOptions(formdata, feature, options);
    } else {
      localStorage.setItem('feature', feature);
      this.singleStepFeatureWithoutOptions(formdata, feature);
    }
  }

  highlightRedactTerm(formdata: FormData, dbPath: any[], feature: string, options: any) {
    console.log("////////////in feature",feature)
    
    if (feature.includes("Delivery Bible")) {
      console.log("////////////in highlightRedactTerm")
      formdata.append('db_paths', JSON.stringify(dbPath));
      if (dbPath.length > 0) {
        formdata.append('is_csv', 'True');
      } else {
        formdata.append('is_csv', 'False');
      }
      localStorage.setItem('feature', feature);
      formdata.append('feature', feature);

      this.process(formdata, '/delivery_bible/build_delivery_bible/');
      return;
    }
    if ((dbPath.length === 0) && (options.word_list.length === 0)) {
      this._modal.showError("Please select at least one csv or keyword");
      return;
    }
    if (options.approx_search === true) {
      formdata.append('approx_search', 'True');
    } else {
      formdata.append('approx_search', 'False');
    }
    if (options.word_list.length > 0) {
      formdata.append('is_csv_search', "False");
      formdata.append('word_list', JSON.stringify(options.word_list));
      formdata.append('db_paths', JSON.stringify([]));
    } else {
      formdata.append('is_csv_search', "True");
      formdata.append('db_paths', JSON.stringify(dbPath));
      formdata.append('word_list', JSON.stringify(options.word_list));
    }

    if (feature === "Highlight Term") {
      formdata.append('feature', 'DB Based Highlight');
      formdata.append('search_on', options.search_on);
      localStorage.setItem('feature', 'DB Based Highlight');
      this.process(formdata, '/database/db_retrieval/');
    }
    else if (feature === "Attribute Retrieval") {
      formdata.append('feature', 'Attribute Retrieval');
      localStorage.setItem('feature', 'Attribute Retrieval');
      this.process(formdata, '/attribute_retrieval/highlight/');
    }
    else {
      formdata.append('feature', 'DB Based Redact');
      formdata.append('search_on', options.search_on);
      localStorage.setItem('feature', 'DB Based Redact');
      this.process(formdata, '/database/db_retrieval/');
    }

  }

  singleStepFeatureWithOptions(formdata: FormData, feature: string, options: any) {
    formdata.append('feature', feature);
    if (feature.includes("Sentiment Detection")) {
      formdata.append('top_lines', options.top_lines.toString());
      this.process(formdata, '/sentences/sentiment_detection/');
    }
    else if (feature === 'Encryption' || feature === 'Decryption') {
      formdata.append('password', options.password);
      feature === 'Encryption' ? this.process(formdata, '/doc_processing/encryption/') : this.process(formdata, '/doc_processing/decryption/');
    }
    else if (feature === 'Metadata Deletion') {
      let metadataListToDelete: string[] = [];
      options.del_attr_list.forEach((element: any) => {
        metadataListToDelete.push(element.item_text);
      })
      console.log(metadataListToDelete);

      formdata.append('del_attr_list', JSON.stringify(metadataListToDelete));
      this.process(formdata, '/doc_processing/metadata_deletion/');
    }
    else if (feature === 'Metadata Updation') {
      formdata.append('rule_file_path', options.rule_file_path.slice(13));
      this.process(formdata, '/doc_processing/metadata_updation/');
    }
    else if (feature === 'Image Augmentation') {
      formdata.append('image_path', options.image_path);
      formdata.append('location', options.location);

      if (options.inPlace) {
        formdata.append('in_place', "True");
      } else {
        formdata.append('in_place', "False");
      }
      // formdata.append('custom_values', JSON.stringify(options.img_aug_customval.split(',')));
      this.process(this.addPageListOrCsvToFormdata(formdata, options), '/doc_processing/add_Image_to_pdf/');
    }
    else if (feature === 'Watermarking') {
      formdata.append('watermark_string', options.watermark_string);
      formdata.append('color', options.color);
      formdata.append('opacity', options.opacity.toString());
      formdata.append('strokes', options.strokes);

      if (options.inPlace) {
        formdata.append('in_place', "True");
      } else {
        formdata.append('in_place', "False");
      }
      this.process(this.addPageListOrCsvToFormdata(formdata, options), '/doc_processing/add_watermark/');
    }
    else if (feature === 'Internal Linking') {
      this.process(this.addPageListOrCsvToFormdata(formdata, options), '/doc_processing/internal_linking/');
    }
    else if (feature === 'Add Bookmarks') {
      this.addBookmarks(formdata, options);
    }
    else if (feature === 'Redact Personal Information') {
      formdata.append('selected_options', JSON.stringify(options.redactPersonalInfo));

      this.process(formdata, '/redact/terms_sentences/');
    }
    else if (feature === 'Document Classification') {
      formdata.append('input_paths', JSON.stringify(options.input_paths));
      formdata.append('confguration_file', options.rule_file_path.slice(13));
      formdata.append('pattern_file', options.pattern_file);

      this.process(formdata, '/doc_processing/document_classification/');
    }
    else if (feature === 'Content Based Grouping') {
      formdata.append('number_of_groups', JSON.stringify(options.number_of_groups));

      this.process(formdata, '/grouping/grouping_content_layout/');
    }
    else if (feature === 'Extractive Summary') {
      formdata.append('summary_num_pages', JSON.stringify(options.number_of_groups));

      this.process(formdata, '/summary/document_summary/');
    }
    else if (feature === 'Anchor Text Extraction') {
      if (options.approx_search === true) {
        formdata.append('approx_search', 'True');
      } else {
        formdata.append('approx_search', 'False');
      }
      formdata.append('anchor_text', JSON.stringify(options.anchor_text.split(',')));
      formdata.append('region_size', JSON.stringify(options.region_size.split(',')));

      this.process(formdata, '/data_extraction/anchor_text/');
    }
    else if (feature === 'Anchor Text Page Ordering') {
      formdata.append('anchor_text', options.anchor_text);

      this.process(formdata, '/data_extraction/anchor_text/');
    }
    else if (feature === 'Anchor Text Page Classification') {
      if (options.approx_search === true) {
        formdata.append('approx_search', 'True');
      } else {
        formdata.append('approx_search', 'False');
      }
      formdata.append('anchor_text', JSON.stringify(options.anchor_text.split(',')));

      this.process(formdata, '/data_extraction/anchor_text/');
    }
    else if (feature === 'Anchor Text Document Classification') {
      if (options.approx_search === true) {
        formdata.append('approx_search', 'True');
      } else {
        formdata.append('approx_search', 'False');
      }
      formdata.append('anchor_text', JSON.stringify(options.anchor_text.split(',')));

      this.process(formdata, '/data_extraction/classify/');
    }
    else if (feature === 'Anchor Text Document Ordering') {
      formdata.append('anchor_text', options.anchor_text);

      this.process(formdata, '/data_extraction/classify/');
    }
    else if (feature === 'Hight Based Highlight') {
      formdata.append('height', options.height);

      this.process(formdata, '/highlight/terms_sentences/');
    }
    else if (feature === 'Split Pdf') {
      console.log(options.input_page_list);
      
      formdata.append('split_pattern', options.split_pattern);
      formdata.append('input_page_list', JSON.stringify([options.input_page_list]));

      this.process(formdata, '/doc_processing/split_pdfs/');
    }
    else if (feature.includes("Page Reordering")) {
      formdata.append('order_list', JSON.stringify(options.order_list));
      if (options.inPlace) {
        formdata.append('in_place', "True");
      } else {
        formdata.append('in_place', "False");
      }

      this.process(formdata, '/pagereorder/reordering/');
    }
    else if (feature.includes("Document merge")) {
      formdata.append('merge_filename', JSON.stringify(options.doc_merge_filename));
      if (options.inPlace) {
        formdata.append('in_place', "True");
      } else {
        formdata.append('in_place', "False");
      }

      this.process(formdata, '/document/merge_positional/');
    }
    else if (feature.includes("Hard time dashboard")) {
      formdata.append('status_file', "");
      formdata.append('mpd_file', "");

      this.process(formdata, '/hard_folder_link/Hdashboard/');
    }
  }

  singleStepFeatureWithoutOptions(formdata: FormData, feature: string) {
    formdata.append('feature', feature);


    if (feature === 'Highlight Infographic') {
      this.process(formdata, '/infographic/feature_infographic/');
    }
    else if (feature === "Color Detection") {
      this.process(formdata, '/doc_processing/color_detection/');
    }
    else if (feature === "Affirmative Sentences") {
      this.process(formdata, '/sentences/affirmative/');
    }
    else if (feature === "Language Detection") {
      this.process(formdata, '/language/language_detection/');
    }
    else if (feature === "Metadata Extraction") {
      this.process(formdata, '/doc_processing/metadata_extraction/');
    }
    else if (feature === "Bookmark Based Split") {
      this.process(formdata, '/bookmarks/split_bookmarks/');
    }
    else if (feature === "Quantitative Sentences") {
      this.process(formdata, '/sentences/quantitative/');
    }
    else if (feature === "Page Similarity") {
      this.process(formdata, '/grouping/grouping_content_layout/');
    }
    else if (feature === "Layout Based Grouping") {
      this.process(formdata, '/grouping/grouping_content_layout/');
    }
    else if (feature === "Quantitative Summary") {
      this.process(formdata, '/summary/quantitative_summary/');
    }
    else if (feature === "Questionary Summary") {
      this.process(formdata, '/summary/questionary_summary/');
    }
    else if (feature === "Highlight Handwritten") {
      this.process(formdata, '/handwritten/handwritten_data/');
    }
    else if (feature === "Redact Handwritten") {
      this.process(formdata, '/handwritten/handwritten_data/');
    }
    else if (feature === "Heading Detection") {
      this.process(formdata, '/heading/heading_detection/');
    }
    else if (feature === "Questionary Detection") {
      this.process(formdata, '/questionary/questionary_detection/');
    }
    else if (feature === 'Redact Infographic') {
      this.process(formdata, '/infographic/feature_infographic/');
    }
    else if (feature.includes("Redact")) {
      this.process(formdata, '/redact/terms_sentences/');
    }
    else if (feature.includes("Highlight")) {
      this.process(formdata, '/highlight/terms_sentences/');
    }
    else if (feature.includes("Hard time folder")) {
      this.process(formdata, '/hard_folder_link/hfolder/');
    }else if (feature === "AMP Build"){
        formdata.append('db_paths', JSON.stringify(JSON.stringify([])));
        formdata.append('is_csv', 'False');
      this.process(formdata, '/amp/dashboard/');
    }
  }

  addPageListOrCsvToFormdata(formdata: FormData, options: any): FormData {
    if (options.page_pattern === "csv") {
      formdata.append('page_list_or_csv', options.rule_file_path.slice(13));
      formdata.append('page_pattern', "None");
      formdata.append('is_csv', "True");
    } else {
      options.page_list_or_csv ? formdata.append('page_list_or_csv', JSON.stringify(options.page_list_or_csv.split(","))) : formdata.append('page_list_or_csv', JSON.stringify([]));
      formdata.append('page_pattern', options.page_pattern);
      formdata.append('is_csv', "False");
    }
    return formdata;
  }

  addBookmarks(formdata: FormData, options: any) {
    if (options.page_pattern === "csv") {
      formdata.append('bookmark_word_or_csv', options.rule_file_path.slice(13))
      formdata.append('input_page_list', "None")
      formdata.append('page_pattern', "None")
      formdata.append('is_csv', "True")
    } else {
      formdata.append('bookmark_word_or_csv', options.bookmark_word_or_csv)
      options.page_list_or_csv ? formdata.append('input_page_list', JSON.stringify(options.page_list_or_csv.split(","))) : formdata.append('input_page_list', JSON.stringify([]));
      formdata.append('page_pattern', options.page_pattern)
      formdata.append('is_csv', "False")
    }
    this.process(formdata, '/bookmarks/add_bookmarks/');
  }

  process(formdata: FormData, url: string) {
    this.http.post(url, formdata).subscribe((res: any) => {
      this._common.containerRef.scrollTop = 0;
      console.log(res);
      this._common.$unselectPdfCsvDirectory.next('');
      this._common.$unselectFeatureCheckbox.next('');
      this._common.$featureName.next('');
      this._common.$featureProgressStart.next('');

      console.log(this._common.containerRef);
      

      // "error" | "success" | "warning" | "info" | "question"
      // if (res['res_data']['OCR_status'] === "PARTIALLY COMPLETE") {
      //   this._modal.showMsg(res['res_str'], "Warning!", "warning");
      // } else {
      //   this._modal.showMsg(res['res_str'], "Success!", "success");
      // }

      // this._modal.showMsg(res['res_str'], "Success!", "success");
      this._modal.showFeatureProcessSuccess(res['res_str']);
    });
  }

}

