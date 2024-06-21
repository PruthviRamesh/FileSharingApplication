import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { UserPortalComponent } from './user-portal/user-portal.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { UploadedFilesComponent } from './uploaded-files/uploaded-files.component';
import { SharedFilesComponent } from './shared-files/shared-files.component';
import { RecyclebinComponent } from './recyclebin/recyclebin.component';
import AdminLoginComponent from './admin-login/admin-login.component';

const routes: Routes = [
  {path:'',component:LandingComponent },
  {path:'signup',component:RegisterComponent},
  {path:'signin',component:LoginComponent},
  {path:'adminPortal',component:AdminPortalComponent},
  {path:'userPortal',component:UserPortalComponent},
  {path:'upload',component:UploadFileComponent},
  { path: 'uploaded-files',component:UploadedFilesComponent},
  {path:'shared-files',component:SharedFilesComponent},
  {path:'recycle-bin',component:RecyclebinComponent},
  {path:'adminLogin',component:AdminLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
