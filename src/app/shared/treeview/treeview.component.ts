import { Component, OnInit, Injectable } from '@angular/core';
import {
  CollectionViewer,
  SelectionChange,
  DataSource,
} from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { DirectoryService } from 'src/app/featuremodules/input-folder/services/directory.service';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';




/** Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(
    public item: object[],
    public level = 1,
    public expandable = false,
    public count: Number,
    public isLoading = false
  ) { }
}

// injactable 
@Injectable({ providedIn: 'root', })
export class DynamicDatabase {
  constructor(private _auth: AuthService, private http: HttpClient, private _common: CommonnService) {
    this._common.$foldersTreeData.subscribe((res: any) => {
      this.rootLevelNodes = [res];
      console.log("rootLevelNodes ??????????????????????????????????????????", this.rootLevelNodes)
    });
  }


  dataMap = new Map<string, object[]>([]);
  count: Number = 0
  alphabatesArray: object[] = []
  charArray: object[] = []


  rootLevelNodes: object[] = [];



  getChildNodeData(path: string) {
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("dir_path", path);

    return this.http.post('/filestorage_features/recursiontree/', formData);
  }

  initialChild() {
    this._common.$foldersTreeData.subscribe((res: any) => {
      this.rootLevelNodes = [res];
    });
  }

  // rootLevelNodes: object[] = [{
  //   "name": this._auth.user_name,
  //   "id": 0,
  //   "path":'Output_Folder/' + this._auth.org_name + '/' + this._auth.user_name,
  //   "type": "directory",
  //   "expanded": false,
  // }];

  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
    // this.initialChild()
    return this.rootLevelNodes.map(
      (item) => new DynamicFlatNode([item], 0, true, this.count)
    );
  }

  getNumbers() {
    return Array.from(Array(11).keys());
  }

  getLetters(n: number): any {
    return String.fromCharCode(65 + n);
  }

  getNodeChildrenData(node: any) {
    let latterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
    return new Promise((resolve, reject) => {
      if (latterArr.includes(node[0].name)) {
        resolve([])
      } else {
        console.log("in new data get section")
        this.getChildNodeData(node[0].path).subscribe((res: any) => {
          console.log("child response", res.res_data.jsonData.children)

          if ((node[0].path).includes('Delivery Bible')) {
            console.log("in build bible sec")
            if (res.res_data.jsonData.is_bible) {
              console.log("true bible")
              console.log(this.getNumbers().push(12))
              this.getNumbers().forEach((c) => {
                console.log(">>>", this.getLetters(c), [this.getLetters(c)])

                node[0].path, res.res_data.jsonData.children.forEach((ele: any) => {
                  console.log("elements are", ele.name.charAt(0))
                  if (ele.name.charAt(0) == this.getLetters(c)) {
                    this.charArray.push(ele)
                  }
                })
                console.log("element and its array", this.getLetters(c), this.charArray)
                let obj = {
                  "name": this.getLetters(c),
                  "path": node[0].path + "/" + this.getLetters(c),
                  "type": res.res_data.jsonData.type,
                  "total_count": this.charArray.length
                }
                console.log(">>>", obj)
                this.alphabatesArray.push(obj)
                this.dataMap.set(node[0].path + "/" + this.getLetters(c), this.charArray)
                this.charArray = []
              })
              console.log("alphabates array", this.alphabatesArray)
              this.dataMap.set(node[0].path, this.alphabatesArray)
              console.log("final dataMap", this.dataMap)
              resolve(this.dataMap)
            } else {
              console.log("false bible")
              console.log("not build bible sec")
              if (res.res_data.jsonData.children.length > 0) {
                this.dataMap.set(node[0].path, res.res_data.jsonData.children)
                resolve(this.dataMap)
              }
            }
          } else {
            console.log("not build bible sec")
            if (res.res_data.jsonData.children.length > 0) {
              this.dataMap.set(node[0].path, res.res_data.jsonData.children)
              resolve(this.dataMap)
            }
          }
        });
      }
    })
  }

  getChildren(node: any) {
    console.log("*****", node, node[0].name, this.dataMap.get(node[0].path))
    return this.dataMap.get(node[0].path);
  }

  isExpandable(node: any): boolean {
    console.log(">>>>>>>", node)
    // console.log(">>>>>>>", node, this.dataMap.has(node.path))
    return this.dataMap.has(node.path);
  }
}

///////
export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] {
    return this.dataChange.value;
  }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe((change) => {
      if (
        (change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(
      map(() => this.data)
    );
  }

  disconnect(collectionViewer: CollectionViewer): void { }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach((node) => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  async toggleNode(node: DynamicFlatNode, expand: boolean) {
    node.isLoading = true;
    console.log("start here .......>>>>", node, node.item[0], expand)
    const result = await this._database.getNodeChildrenData(node.item)
    console.log("promise result is ....", result)
    const children = await this._database.getChildren(node.item);
    console.log('childrens are', children);
    console.log('data is', this.data);
    const index = this.data.indexOf(node);
    console.log('index is', index, (!children || index < 0));
    if (!children || index < 0) {
      // If no children, or cannot find the node, no op
      return;
    }


    setTimeout(() => {
      if (expand) {
        const nodes = children.map(
          (name) =>
            new DynamicFlatNode(
              [name],
              node.level + 1,
              this._database.isExpandable(name),
              children.length
            )
        );
        this.data.splice(index + 1, 0, ...nodes);
      } else {
        let count = 0;
        for (
          let i = index + 1;
          i < this.data.length && this.data[i].level > node.level;
          i++, count++
        ) { }
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      node.isLoading = false;
    });
  }

}



@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss'],
  providers: [DirectoryService]

})
// export class TreeviewComponent implements OnInit {

//   constructor() { }



// }
export class TreeviewComponent implements OnInit {
  constructor(private database: DynamicDatabase, private _common: CommonnService, private _directory: DirectoryService, private route: ActivatedRoute, private router: Router) {

    // this.router.routeReuseStrategy.shouldReuseRoute = () => {
    //   console.log("change param")
    //   this.initialFunction()
    //   return false;
    // }

    this._common.$foldersTreeData.subscribe((res: any) => {
      console.log("rootLevelNodes changed ??????????????????????????????????????????", res)
      this.ngOnInit()
    });


  }

  ngOnInit(): void {
    console.log("ngoninit called")
    this.initialFunction()
  }

  async initialFunction() {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new DynamicDataSource(this.treeControl, this.database);

    this.dataSource.data = await this.database.initialData();
    console.log("initial data", this.dataSource.data)
  }


  //   ngOnInit(): void {
  //    this.dataSource.data = await this.database.initialData();

  // }

  treeControl: FlatTreeControl<DynamicFlatNode>;

  dataSource: DynamicDataSource;

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  selectedNode(val: any) {
    console.log("selectedNode is", val.item[0].path)
    console.log("addd val", this.database.dataMap)
    this.redirectUserToDir(val.item[0].path)

    //     this._directory.getChildNodeData(val.item[0].path).subscribe((res: any) => {
    //   console.log("child response",res.res_data.jsonData.children)
    //   if(res.res_data.jsonData.children.length>0){
    //   this.database.dataMap.set(val.item[0].path,res.res_data.jsonData.children)
    //   }
    // });

    // this.database.dataMap.set("Output_Folder/ORG@STS/shubham21/BibleData", [
    //   {
    //     "name": "02_Certified Non-Incident Statement_2021.06.12 (002)_output",
    //     "id": 1,
    //     "path": "Output_Folder/ORG@STS/shubham21/BibleData/02_Certified Non-Incident Statement_2021.06.12 (002)_output",
    //     "type": "directory",
    //     "expanded": false,
    //     "children": []
    //   },
    //   {
    //     "name": "00___086_output",
    //     "id": 1,
    //     "path": "Output_Folder/ORG@STS/shubham21/BibleData/00___086_output",
    //     "type": "directory",
    //     "expanded": false,
    //     "children": []
    //   },
    //   {
    //     "name": "1. Current Time In Service 13-May-2019_output",
    //     "id": 1,
    //     "path": "Output_Folder/ORG@STS/shubham21/BibleData/1. Current Time In Service 13-May-2019_output",
    //     "type": "directory",
    //     "expanded": false,
    //     "children": []
    //   },
    //   {
    //     "name": "output",
    //     "id": 1,
    //     "path": "Output_Folder/ORG@STS/shubham21/BibleData/output",
    //     "type": "directory",
    //     "expanded": false,
    //     "children": []
    //   }
    // ])

    console.log("addd val", this.database.dataMap)
  }

  redirectUserToDir(path: string) {
    if (path.includes('Delivery Bible')) {
      let latterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
      // if(latterArr.includes(node[0].name)){
      //   resolve([])
      //  }
      let splitVal = path.split('/')
      console.log("splitval", splitVal)
      let checkval = splitVal[splitVal.length - 1]
      console.log("checkval is", checkval)
      if (latterArr.includes(checkval)) {
        splitVal.pop()
        console.log("splitval", splitVal)
        path = splitVal.join('/')+'/'
      }else{
      path = path + '/'
      }
    } else {
      path = path + '/'
    }
    console.log("in redirect user to dir>>>>>>>>>>>>>", path)

    if (path.includes('Input')) {
      this._common.redirectToNestedFolder(path, 'input');
    } else if (path.includes('Req')) {
      this._common.redirectToNestedFolder(path, 'req');
    } else if (path.includes('Err_Info')) {
      this._common.redirectToNestedFolder(path, 'err');
    } else if (path.includes('Output')) {
      this._common.redirectToNestedFolder(path, 'output');
    }
  }

}