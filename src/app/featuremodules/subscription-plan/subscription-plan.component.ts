import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/_helpers/services/modal.service';
import { SubscriptionService } from './services/subscription.service';

declare var Stripe: any;

interface SingleFeature {
  product: string, quantity: any, basePrice: any, price: any, isSelected: boolean, details: string;
}

interface features {
  heading: string;
  features: SingleFeature[];
}

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss'],
  providers: [SubscriptionService]
})
export class SubscriptionPlanComponent implements OnInit {

  totalPrice: number = 0;
  publish_key: any = null;

  selectAllCheck: boolean = false;

  // priceBasedCheck: boolean = true;
  // subsriptionBasedCheck: boolean = false;

  buyType: string = "price";

  featureList: features[] = [
    {
      heading: "Build Records",
      features: [
        { product: 'Hard time folder', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Highlight a set of terms in a document based on pre-defined keyword list' },
        { product: 'Document Classification', quantity: "1000", basePrice: "299", price: "299", isSelected: false, details: 'Redact a set of terms in a document based on pre-defined keyword list' },
        { product: 'Image Augmentation', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Highlight a set of terms in a document based on pre-defined keyword list' },
        { product: 'Watermarking', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Redact a set of terms in a document based on pre-defined keyword list' }
      ]
    }
    // {
    //   heading: "Bulk Search",
    //   features: [
    //     { product: 'DB Based Highlight', quantity: "1000", basePrice: "20", price: "20", isSelected: false, details: 'Highlight a set of terms in a document based on pre-defined keyword list' },
    //     { product: 'DB Based Redact', quantity: "1000", basePrice: "299", price: "299", isSelected: false, details: 'Redact a set of terms in a document based on pre-defined keyword list' }
    //   ]
    // },
    // {
    //   heading: "Document Processing",
    //   features: [
    //     { product: 'Attribute Retrieval', quantity: "1000", basePrice: "20", price: "20", isSelected: false, details: 'Retrieve key information from documents based on attribute names' },
    //     { product: 'Document Classification', quantity: "1000", basePrice: "299", price: "299", isSelected: false, details: 'Categorize and label documents appropriately based on keywords and key information' },
    //     { product: 'Image Augmentation', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Augment images at at various positions on a selected set of pages in a document' },
    //     { product: 'Watermarking', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Add watermark content for native/scanned PDF documents' },
    //     { product: 'Encryption', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Use list/pattern of passwords to protect documents with passwords' },
    //     { product: 'Decryption', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Use list/pattern of passwords to protect documents with passwords' },
    //     { product: 'Metadata Extraction', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: ' Retrieving embedded metadata such as author name, creation date, page count etc. from documents' },
    //     { product: 'Metadata Deletion', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: ' Remove sensitive metadata such as author name, creation date, page count etc. from documents' },
    //     { product: 'Metadata Updation', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Modify sensitive metadata such as author name, document source etc. from documents' },
    //     { product: 'Add Bookmarks', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Adding bookmarks for providing quick access to particular pages' },
    //     { product: 'Bookmark Based Split', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Splitting one or more documents into many documents based on various criteria' },
    //     { product: 'Internal Linking', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Create clickable links between a set of pages for quick browsing' }
    //   ]
    // },
    // {
    //   heading: "Redaction",
    //   features: [
    //     { product: 'Redact People Terms', quantity: "1000", basePrice: "299", price: "299", isSelected: false, details: 'Masking any references made regarding a person' },
    //     { product: 'Redact Place Terms', quantity: "1000", basePrice: "299", price: "299", isSelected: false, details: 'Masking any references made regarding a place' },
    //     { product: 'Redact Date Terms', quantity: "1000", basePrice: "299", price: "299", isSelected: false, details: 'Masking any references made regarding a date' },
    //     { product: 'Redact Numeric Terms', quantity: "1000", basePrice: "299", price: "299", isSelected: false, details: 'Masking of any numeric terms mentioned in a document' },
    //     { product: 'Redact Infographic', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'A unique data masking feature for redacting visual data such as graphs, charts, photos' },
    //     { product: 'Redact Personal Information', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Masking sensitive personal information across documents with the click of a button' }
    //   ]
    // },
    // {
    //   heading: "Highlight",
    //   features: [
    //     { product: 'Highlight People Terms', quantity: "1000", basePrice: "399", price: "399", isSelected: false, details: 'Identify and highlight references to people in a document' },
    //     { product: 'Highlight Place Terms', quantity: "1000", basePrice: "399", price: "399", isSelected: false, details: 'Identify and highlight references to geographical places in a document' },
    //     { product: 'Highlight Date Terms', quantity: "1000", basePrice: "399", price: "399", isSelected: false, details: 'Identify and highlight any dates or numeric terms in a document ' },
    //     { product: 'Highlight Numeric Terms', quantity: "1000", basePrice: "399", price: "399", isSelected: false, details: 'Identify and highlight any dates or numeric terms in a document ' },
    //     { product: 'Highlight Infographic', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Identify and highlight visual and graphical data along with page numbers' }
    //   ]
    // },
    // {
    //   heading: "Sentence Analysis",
    //   features: [
    //     { product: 'Language Detection', quantity: "1000", basePrice: "299", price: "299", isSelected: false, details: 'Seggregate documents/pages based on languages' },
    //     { product: 'Affirmative Sentences', quantity: "1000", basePrice: "199", price: "199", isSelected: false, details: 'Identify sentences that confirm certain conditions or scenarios' },
    //     { product: 'Sentiment Detection', quantity: "1000", basePrice: "199", price: "199", isSelected: false, details: 'Show the most positive and negative sentences in a document' },
    //     { product: 'Quantitative Sentences', quantity: "1000", basePrice: "199", price: "199", isSelected: false, details: 'Show the most positive and negative sentences in a document' }
    //   ]
    // },
    // {
    //   heading: "Data Extraction",
    //   features: [{ product: 'Color Detection', quantity: "1000", basePrice: "199", price: "199", isSelected: false, details: 'Identify various colours present in different pages of a document' }]
    // },
    // {
    //   heading: "Others",
    //   features: [
    //     { product: 'Page Similarity', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Retrieve highly similar sentences to a given sentence/set of sentences' },
    //     { product: 'Layout Based Grouping', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Group documents based on layout of documents' },
    //     { product: 'Quantitative Summary', quantity: "1000", basePrice: "399", price: "399", isSelected: false, details: 'Show key information and associated page numbers' },
    //     // { product: 'Questionary Summary', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Identify pages that contain Q&A sections in a document' },
    //     { product: 'Highlight Handwritten', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Identify hand written sections present in documents' },
    //     { product: 'Redact Handwritten', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Redacting handwritten sections in documents' },
    //     { product: 'Heading Detection', quantity: "1000", basePrice: "199", price: "199", isSelected: false, details: 'Detect headings present in documents ' },
    //     { product: 'Questionary Detection', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Identify pages that contain Q&A sections in a document' },
    //     { product: 'Content Based Grouping', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Group documents based on textual content' },
    //     { product: 'Extractive Summary', quantity: "1000", basePrice: "399", price: "399", isSelected: false, details: 'Extract salient information that forms a concise summary of a document' },
    //     { product: 'Anchor Text Extraction', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Extract pages that have specific values for key attributes such as dates' },
    //     { product: 'Anchor Text Page Ordering', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Sort pages based on key attributes such as dates' },
    //     { product: 'Anchor Text Page Classification', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Classify pages based on specific values for key attributes such as dates' },
    //     { product: 'Anchor Text Document Classification', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Classify documents based on presence of specific values for key attributes such as dates' },
    //     { product: 'Anchor Text Document Ordering', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Sort documents based on key attributes such as dates' },
    //     { product: 'Hight Based Highlight', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Detect pages with objects of certain height such as stamps/seals/photos' },
    //     { product: 'Split Pdf', quantity: "1000", basePrice: "99", price: "99", isSelected: false, details: 'Split a PDF document/set of PDF documents into single page documents with the click of a button' }
    //   ]
    // }
  ];

  constructor(private _subscription: SubscriptionService, private _modal: ModalService, private router:Router) { }

  ngOnInit(): void {
    this.getPublishKey();
  }

  getPublishKey() {
    this._subscription.getStripePublishKey().subscribe((value) => {
      console.log(value);

      this.publish_key = value
    })
  }

  onChangeBuyingType(type:string) {
    if (this.buyType === 'price') {
      // this.priceBasedCheck = true;
      // this.subsriptionBasedCheck = false;

      this.featureList.forEach(elem => {
        elem.features.forEach(res => {
          res.basePrice = "99";
          res.price = "99";
          res.quantity = "1000";
        })
      })

      this.totalPrice = this.calculateTotalPrice();
    }
    else if (this.buyType === 'subscription') {
      this.featureList.forEach(elem => {
        elem.features.forEach(res => {
          res.basePrice = "1000";
          res.price = "1000";
          res.quantity = "1000";
        })
      })

      this.totalPrice = this.calculateTotalPrice();
    } 
    else {
      this.featureList.forEach(elem => {
        elem.features.forEach(res => {
          res.basePrice = "99";
          res.price = "99";
          res.quantity = "1000";
        })
      })

      this.totalPrice = this.calculateTotalPrice();
    }
  }

  updatePrice(i: any, j: any) {
    this.featureList[i].features[j].price = (this.featureList[i].features[j].quantity / 1000) * this.featureList[i].features[j].basePrice;
    this.totalPrice = this.calculateTotalPrice();
  }

  selectProduct(i: any, j: any) {
    this.featureList[i].features[j].isSelected = !this.featureList[i].features[j].isSelected;
    this.totalPrice = this.calculateTotalPrice();
  }

  selectAllProduct() {
    if (this.selectAllCheck) {
      this.featureList.forEach((res, i) => {
        res.features.forEach((res2: any, j: any) => {
          this.featureList[i].features[j].isSelected = true;
          this.totalPrice = this.calculateTotalPrice();
        })
      })
    } else {
      this.featureList.forEach((res, i) => {
        res.features.forEach((res2: any, j: any) => {
          this.featureList[i].features[j].isSelected = false;
          this.totalPrice = this.calculateTotalPrice();
        })
      })
    }
  }

  calculateTotalPrice() {
    let totalPrice: number = 0;
    for (let i = 0; i < this.featureList.length; i++) {
      for (let j = 0; j < this.featureList[i].features.length; j++) {
        if (this.featureList[i].features[j].isSelected) {
          totalPrice += parseInt(this.featureList[i].features[j].price);
        }
      }
    }
    return totalPrice;
  }

  buyProducts() {
    const formdata: FormData = new FormData;

    let userId = localStorage.getItem("user_id");
    formdata.append('user_id', userId);

    let productsArr: any[] = [];

    this.featureList.forEach((item) => {
      return item.features.forEach((item2: any) => {
        if (item2.isSelected) {
          productsArr.push({ product: item2.product, quantity: item2.quantity });
        }
      });
    });

    if (productsArr.length === 0) {
      this._modal.showMsg("Please select atleast one product", "info", "info");
      return;
    }

    let productdata = JSON.stringify(productsArr);
    formdata.append('pay_data', productdata);

    console.log(productdata);

    this._subscription.buy(formdata).subscribe(res => {
      console.log(res);
      let key = this.publish_key['publicKey'];
      /* global Stripe */
      if (typeof Stripe !== "undefined") {
        /* global Stripe */
        var stripe = Stripe(key);
      } else {
        this._modal.showError("Stripe Object Not Found!!!");
      }
      if (this.buyType === 'price') {
        stripe.redirectToCheckout(res);
      }
      else if (this.buyType === 'subscription') {
        this.router.navigate(['/viewDir/subscriptions/verifypromocode'])
      }
    })
  }

}
