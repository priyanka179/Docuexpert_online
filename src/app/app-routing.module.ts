import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LinkUploadAuthSuccessComponent } from './shared/link-upload-auth-success/link-upload-auth-success.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: "", component: LandingPageComponent, canActivate: [AuthGuard] },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'viewDir',
    loadChildren: () => import('./maincontainer/maincontainer.module').then(m => m.MaincontainerModule)
  },
  {
    path: 'link_upload/token',
    component: LinkUploadAuthSuccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  providers: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
