import { Component, OnInit } from '@angular/core';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalService } from 'src/app/_helpers/services/modal.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userData:any
  updateUserList: any[];
  userList: any = []

  addUserFlag:boolean=true
  updateUserFlag:boolean=false
  addUserProjDetails:any

  constructor(private _common: CommonnService,private _modal: ModalService, private http: HttpClient, private _auth: AuthService) { 
    this._common.$addUserDetailsData.subscribe((res:any)=>{
      this.userData=res
      this.userList=[]
      this.ngOnInit()
      // console.log("this user data is",this.userData)
    })
  }

  ngOnInit(): void {
    this.setAddUserList()
  }

  
  

  setAddUserList() {
    this.updateUserFlag=false
    this.addUserFlag=true
    this.userList=[]
    this.getUserList().subscribe((res: any) => {
      for (let i = 0; i < res.res_data.length; i++) {
        res.res_data[i].isSelected = false
        res.res_data[i].role = ""
        if (res.res_data[i].user_id != this._auth.user_id && !(res.res_data[i].email=='admin@statvalu.com')) {
          this.userList.push(res.res_data[i])
        }
      }
      // this.userList = res.res_data
      console.log("res is", this.userList)
    })
  }

  setUpdateUserList(){
    this.updateUserList=[]
    this.updateUserFlag=true
    this.addUserFlag=false
    this.getAssignedUser().subscribe((res:any)=>{
      // console.log("res is getAssignedUser",res.res_data)
      // this.updateUserList=res.res_data
      res.res_data.forEach((ele:any)=>{
        let dom=ele.assigned_to.split('@').pop()
        let org=dom.split('.')[0]
        // console.log("username is",org)
        let userObj={
          username:ele.assigned_to.split('.')[0],
          email:ele.assigned_to,
          org_name:org,
          role:ele.role,
          isSelected:false,
          user_id:ele.assigned_id
        }
        // let index=this.updateUserList.findIndex((el:any)=> el.email==ele.assigned_to)
        // if (index>)
        this.updateUserList.push(userObj)
      })
    })
    this.userList=this.updateUserList
  }

  getUserList() {
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    return this.http.post('/document_upload/userlist/', formData);
  }

  getAssignedUser(){
    // /document_upload/user_list/all/?p=1&user_id=2&filer_by={"user":"","assigned_to":"","project_path":"","role":""}
   let filerObj={
      user:"",
      assigned_to:"",
      project_path:"",
      role:""
    }
    return this.http.get("/document_upload/user_list/all/?p=1&user_id=" + this._auth.user_id + '&filer_by=' + JSON.stringify(filerObj));

  }

  addSelectedUser() {
    let selectedUserList: any = []
    this.userList.forEach((ele: any) => {
      if (ele.isSelected) {
        let obj = {
          assigned_id: ele.user_id,
          role: ele.role
        }
        selectedUserList.push(obj)
      }
    })

    let req = {
      project_path: this.userData.path+"/"+this.userData.name,
      userList: selectedUserList
    }

    console.log("add user req is",req)

    if (selectedUserList.length <= 0) {
      this._modal.showError("Please select user.");
    } else {
      console.log("add user ...", req)
      this.addUserToDb(req).subscribe((res: any) => {
        console.log("res is",res)
      this._modal.showFeatureProcessSuccess(res.res_str);
      })
      
    }

    let index = this.userList.findIndex((ele: any) => ele.isSelected == true)
    if (index > -1) {

    } else {
      this._modal.showError("Please select user.");
    }

  }

  addUserToDb(req:any){
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("project_detail", JSON.stringify(req));
    return this.http.post('/document_upload/add_role/', formData);
  }

}
