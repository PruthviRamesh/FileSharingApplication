import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { HttpClientModule } from '@angular/common/http';
import { UserPortalComponent } from './user-portal/user-portal.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { UploadedFilesComponent } from './uploaded-files/uploaded-files.component';
import { SharedFilesComponent } from './shared-files/shared-files.component';
import { RecyclebinComponent } from './recyclebin/recyclebin.component';
import { FileManagementComponent } from './file-management/file-management.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FileStatsChartComponent } from './file-stats-chart/file-stats-chart.component';
import AdminLoginComponent from './admin-login/admin-login.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RegisterComponent,
    LoginComponent,
    AdminPortalComponent,
    UserPortalComponent,
    UploadFileComponent,
    UploadedFilesComponent,
    SharedFilesComponent,
    RecyclebinComponent,
    FileManagementComponent,
    FileStatsChartComponent,
    AdminLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HighchartsChartModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
