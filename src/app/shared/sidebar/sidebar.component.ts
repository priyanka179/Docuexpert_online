import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Router, ActivatedRoute } from '@angular/router';
import { DataLakeDirectoryClient, DataLakeServiceClient } from '@azure/storage-file-datalake';
import { expand } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { UploadDirectoryService } from 'src/app/_helpers/services/upload-directory.service';
import { TreeNgx } from 'tree-ngx';
import { DirectoryService } from 'src/app/featuremodules/input-folder/services/directory.service';
import { FlatTreeControl } from '@angular/cdk/tree';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [DirectoryService]
})
export class SidebarComponent implements OnInit {

  featureHeading?: string;
  feature?: string;

  featureList: any[] = [
    { heading: "Delivery bible", features: [{ featureName: "Extract status sheet", showFeatureName: "Extract status sheets", checked: false }, { featureName: "Validate status sheet", showFeatureName: "Validate status sheet", checked: false }, { featureName: "Build empty delivery bible", showFeatureName: "Build empty delivery bible", checked: false }, { featureName: "Delivery Bible", showFeatureName: "Delivery bible", checked: false }], expand: false },
    { heading: "Build records", features: [{ featureName: "Hard time folder", showFeatureName: "Hard time folder", checked: false }, { featureName: "Hard time dashboard", showFeatureName: "Hard time dashboard", checked: false },{ featureName: "NIS calculation", showFeatureName: "NIS calculation", checked: false }, { featureName: "Back2birth calculation", showFeatureName: "Back2birth calculation", checked: false }, { featureName: "Avionics listing", showFeatureName: "Avionics listing", checked: false }, { featureName: "AMP Build", showFeatureName: "AMP build", checked: false }], expand: false },
    { heading: "Process records", features: [{ featureName: "Image Augmentation", showFeatureName: "Image augmentation", checked: false }, { featureName: "Watermarking", showFeatureName: "Watermarking", checked: false }, { featureName: "Document merge", showFeatureName: "Document merge", checked: false }, { featureName: "Page Reordering", showFeatureName: "Page reordering", checked: false }], expand: false },

    // { heading: "Bulk Search", features: [{ featureName: "Highlight Term", checked: false }, { featureName: "Redaction Term", checked: false }], expand: false },  // { featureName: "Document Classification", checked: false }

    // { heading: "Document Processing", features: [{ featureName: "Attribute Retrieval", checked: false }, { featureName: "Document Classification", checked: false }, { featureName: "Image Augmentation", checked: false }, { featureName: "Watermarking", checked: false }, { featureName: "Encryption", checked: false }, { featureName: "Decryption", checked: false }, { featureName: "Metadata Extraction", checked: false }, { featureName: "Metadata Deletion", checked: false }, { featureName: "Metadata Updation", checked: false }, { featureName: "Add Bookmarks", checked: false }, { featureName: "Bookmark Based Split", checked: false }, { featureName: "Internal Linking", checked: false }], expand: false },

    // { heading: "Redaction", features: [{ featureName: "Redact Personal Information", checked: false }, { featureName: "Redact People Terms", checked: false }, { featureName: "Redact Place Terms", checked: false }, { featureName: "Redact Date Terms", checked: false }, { featureName: "Redact Numeric Terms", checked: false }, { featureName: "Redact Infographic", checked: false }], expand: false },

    // { heading: "Highlight", features: [{ featureName: "Highlight People Terms", checked: false }, { featureName: "Highlight Place Terms", checked: false }, { featureName: "Highlight Date Terms", checked: false }, { featureName: "Highlight Numeric Terms", checked: false }, { featureName: "Highlight Infographic", checked: false }], expand: false },

    // { heading: "Sentence Analysis", features: [{ featureName: "Language Detection" }, { featureName: "Affirmative Sentences" }, { featureName: "Sentiment Detection" }, { featureName: "Quantitative Sentences" }], expand: false },

    // { heading: "Data Extraction", features: [{ featureName: "Color Detection", checked: false }], expand: false },

    // {
    //   heading: "Others", features: [
    //     { featureName: "Page Similarity", checked: false },
    //     { featureName: "Layout Based Grouping", checked: false },
    //     { featureName: "Quantitative Summary", checked: false },
    //     // { featureName: "Questionary Summary", checked: false },
    //     { featureName: "Highlight Handwritten", checked: false },
    //     { featureName: "Redact Handwritten", checked: false },
    //     { featureName: "Heading Detection", checked: false },
    //     { featureName: "Questionary Detection", checked: false },
    //     { featureName: "Content Based Grouping", checked: false },
    //     { featureName: "Extractive Summary", checked: false },
    //     { featureName: "Anchor Text Extraction", checked: false },
    //     { featureName: "Anchor Text Page Ordering", checked: false },
    //     { featureName: "Anchor Text Page Classification", checked: false },
    //     { featureName: "Anchor Text Document Classification", checked: false },
    //     { featureName: "Anchor Text Document Ordering", checked: false },
    //     { featureName: "Hight Based Highlight", checked: false },
    //     { featureName: "Split Pdf", checked: false }
    //   ],
    //   expand: false
    // }
  ]

  treeView: boolean = false;
  folderTreeView: boolean = false
  featureListView: boolean = true

  nodeItems: any[] = [];

  constructor(private _common: CommonnService, private router: Router, private _uploadDirService: UploadDirectoryService, private route: ActivatedRoute, private _auth: AuthService) {
    this._common.$showTree.subscribe((res) => {
      this.treeView = res;
      // console.log("treeeee view ........",this.treeView,this.folderTreeView,this.featureListView)
    });

    this._common.$showFolderTree.subscribe((res) => {
      this.folderTreeView = res
      // console.log("treeeee view ........",this.treeView,this.folderTreeView,this.featureListView)

    });

    this._common.$showFeatureList.subscribe((res) => {
      this.featureListView = res;
      // console.log("treeeee view ........",this.treeView,this.folderTreeView,this.featureListView)
    });

    this.router.events.subscribe(routeParams => {
      console.log("param change", this.router.url)
      let pathList = JSON.parse(localStorage.getItem('output'));
      if (pathList != null) {
        pathList = pathList.join("/")
        let isBible = pathList.includes('Delivery Bible')

        if (isBible && this.router.url == '/viewDir/output-folder') {
          this.treeView = false
          this.folderTreeView = true
          this.featureListView = false
        } else {
          this.treeView = false
          this.folderTreeView = false
          this.featureListView = true
        }
      } else {
        this.treeView = false
        this.folderTreeView = false
        this.featureListView = true
      }
      // this.treeView=false
      // this.folderTreeView=false
      // this.featureListView=true
      // this.ngOnInit()
    });
  }

  async ngOnInit() {
    this._common.$unselectFeatureCheckbox.subscribe(res => {
      this.onCheckboxChanged('');
      localStorage.removeItem('sidebaractivefeature')
    });
    this.onCheckboxChanged(localStorage.getItem('sidebaractivefeature'));

    this._common.$foldersTreeData.subscribe((res: any) => {
      // this.nodeItems = [res.res_data.jsonData];
    });

    // var folderNode = JSON.parse(localStorage.getItem('foldertree'))

    // if(folderNode!=null){
    //   this._common.$selectedFolderData.next(folderNode);
    //   this._common.$showFeatureList.next(false)
    //   this._common.$showTree.next(false)
    //   this._common.$showFolderTree.next(true)
    // }






    // localStorage.setItem('foldertree',JSON.stringify(rootDir))


    // console.log(this._uploadDirService.getFileSystemClient(""));
    // for await (const blob of this._uploadDirService.getFileSystemClient("", "docuexpertuat2/G_input/").listPaths()) {
    //   console.log(`path: ${blob.name}`);
    // }

    // const account = "docuexpertstorage";
    // const sas = "?sp=racwdlmeop&st=2022-08-11T07:32:44Z&se=2023-02-08T15:32:44Z&sip=49.37.42.93&sv=2021-06-08&sr=d&sig=n73FAbd%2BPIceTORyHjhcvCM8H3gj0fXZid44PXNnHv8%3D&sdd=2";

    // const datalakeServiceClient = new DataLakeServiceClient(
    //   `https://${account}.dfs.core.windows.net${sas}`
    // );

    // const fileSystemName = "docuexpertuat2/Output_Folder";

    // const fileSystemClient = datalakeServiceClient.getFileSystemClient(fileSystemName);

    // const directoryClient: DataLakeDirectoryClient = fileSystemClient.getDirectoryClient("Input_Folder");

    // console.log(fileSystemClient.url);

    // let i = 1;
    // let paths = fileSystemClient.listPaths();
    // for await (const path of paths) {
    //   console.log(`Path ${i++}: ${path.name}, is directory: ${path.isDirectory}`);
    // }
  }

  onCheckboxChanged(feature: any) {
    this.featureList.forEach(res => {
      res.features.forEach((data: any) => {
        if (data.featureName === feature) {
          data.checked = true;
          localStorage.setItem('sidebaractivefeature', feature);
        } else {
          data.checked = false;
        }
      })
    })
  }

  hideCollasibleMenu() {
    return this.router.url === '/viewDir/myfiles' || this.router.url === '/viewDir/output-folder' || this.router.url === '/viewDir/request-folder';
  }

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  // setFeatureHeading(featureHeading: string) {
  //   if (this.featureHeading !== featureHeading) {
  //     this.featureHeading = featureHeading 
  //   } else {
  //     this.featureHeading = ""
  //   }
  // }

  // setFeature(feature: string) {
  //   if (this.feature !== feature) {
  //     this.feature = feature
  //   } else {
  //     this.feature = ""
  //   }
  // }
  removeData() {
    localStorage.removeItem('bible_folder_list');
  }


  showFeatures() {
    this._common.$showFeatureList.next(true)
    this._common.$showFolderTree.next(false)
    this._common.$showTree.next(false)
  }

  showFolder() {
    this._common.$showFeatureList.next(false)
    this._common.$showFolderTree.next(true)
    this._common.$showTree.next(false)
  }



}


// this.nodeItems = [
//   {
//     id: '0',
//     name: 'Heros',
//     expanded: false,
//     children: [
//       {
//         id: '1',
//         name: 'Batman',
//         item: {
//           phrase: 'I am the batman'
//         }
//       },
//       {
//         id: '2',
//         name: 'Superman',
//         item: {
//           phrase: 'Man of steel'
//         }
//       }
//     ]
//   },
//   {
//     id: '3',
//     name: 'Villains',
//     expanded: false,
//     children: [
//       {
//         id: '4',
//         name: 'Joker',
//         item: {
//           phrase: 'Why so serius'
//         }
//       },
//       {
//         id: '5',
//         name: 'Lex luthor',
//         item: {
//           phrase: 'I am the villain of this story'
//         }
//       }
//     ]
//   }
// ];


