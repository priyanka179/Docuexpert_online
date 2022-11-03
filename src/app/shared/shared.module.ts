import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopnavComponent } from './topnav/topnav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PreviewPdfComponent } from './preview-pdf/preview-pdf.component';
import { CollapsibleMenuComponent } from './collapsible-menu/collapsible-menu.component';
import { FormsModule } from '@angular/forms';
import { DirectoryComponent } from './directory/directory.component';
import { ModalComponent } from './modal/modal.component';
import { RouterModule } from '@angular/router';
import { OffCanvasComponent } from './off-canvas/off-canvas.component';
import { PreviewCsvComponent } from './preview-csv/preview-csv.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularDraggableModule } from 'angular2-draggable';
import { FileUploadModalComponent } from './file-upload-modal/file-upload-modal.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgxFilesizeModule } from 'ngx-filesize';
import { SvgPdfFileComponent } from './svg/svg-pdf-file/svg-pdf-file.component';
import { SvgFolderComponent } from './svg/svg-folder/svg-folder.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PreviewTxtComponent } from './preview-txt/preview-txt.component';
import { DownloadModalComponent } from './download-modal/download-modal.component';
import { LinkUploadAuthSuccessComponent } from './link-upload-auth-success/link-upload-auth-success.component';
import { TreeGraphComponent } from './tree-graph/tree-graph.component';
import { VirtualUploadModalComponent } from './virtual-upload-modal/virtual-upload-modal.component';
import { BuildDeliveryBibleComponent } from './build-delivery-bible/build-delivery-bible.component';
import { BuildDeliveryBible2Component } from './build-delivery-bible2/build-delivery-bible2.component';
import { PreviewImageComponent } from './preview-image/preview-image.component';
import { PopoverModule } from 'ngx-smart-popover';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { TreeNgxModule } from 'tree-ngx';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TreeviewComponent } from './treeview/treeview.component';
import { FolderTreeviewComponent } from './folder-treeview/folder-treeview.component';
import {MatMenuModule} from '@angular/material/menu';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  declarations: [
    TopnavComponent,
    SidebarComponent,
    PreviewPdfComponent,
    CollapsibleMenuComponent,
    DirectoryComponent,
    ModalComponent,
    OffCanvasComponent,
    PreviewCsvComponent,
    FileUploadModalComponent,
    SvgPdfFileComponent,
    SvgFolderComponent,
    PreviewTxtComponent,
    DownloadModalComponent,
    LinkUploadAuthSuccessComponent,
    TreeGraphComponent,
    VirtualUploadModalComponent,
    BuildDeliveryBibleComponent,
    PreviewImageComponent,
    TreeviewComponent,
    FolderTreeviewComponent,
    AddUserComponent,
    BuildDeliveryBible2Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    AngularDraggableModule,
    RouterModule,
    RoundProgressModule,
    NgxFilesizeModule,
    NgxSkeletonLoaderModule,
    PopoverModule,
    MatTreeModule,
    MatIconModule,
    TreeNgxModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  exports: [
    TopnavComponent,
    SidebarComponent,
    PreviewPdfComponent,
    CollapsibleMenuComponent,
    DirectoryComponent,
    ModalComponent,
    OffCanvasComponent,
    PreviewCsvComponent,
    FileUploadModalComponent,
    PreviewTxtComponent,
    DownloadModalComponent,
    LinkUploadAuthSuccessComponent,
    SvgPdfFileComponent,
    TreeGraphComponent,
    VirtualUploadModalComponent,
    BuildDeliveryBibleComponent,
    BuildDeliveryBible2Component,
    PreviewImageComponent,
    MatProgressSpinnerModule,
    TreeviewComponent,
    FolderTreeviewComponent,
    MatMenuModule,
    AddUserComponent
  ],
  providers: []
})
export class SharedModule { }
