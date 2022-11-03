import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-upload-auth-success',
  templateUrl: './link-upload-auth-success.component.html',
  styleUrls: ['./link-upload-auth-success.component.scss']
})
export class LinkUploadAuthSuccessComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log(window.location.href);
  }

}
