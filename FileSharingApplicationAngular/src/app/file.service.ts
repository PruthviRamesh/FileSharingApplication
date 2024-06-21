import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  registerUser(user: any) {
    return this.http.post(`https://localhost:7248/api/User/register`, user);
  }

  loginUser(user: any) {
    return this.http.post(`https://localhost:7248/api/User/login`, user);
  }

  uploadFile(file: File, uploadedByUserId: number, isPermanent: boolean, retentionDate: string | null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('UploadedByUserId', uploadedByUserId.toString());
    formData.append('IsPermanent', isPermanent.toString());
    if (retentionDate) {
      formData.append('RetentionDate', retentionDate);
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(`https://localhost:7248/api/File/upload`, formData, { headers })
  }
  getAllUsers() {
    return this.http.get(`https://localhost:7248/api/User/users`)
  }
  getUserByEmail(email:string){
    return this.http.get(`https://localhost:7248/api/User/${email}`)
  }
  getFileByUSerid(userid:any){
    return this.http.get(`https://localhost:7248/api/File/getFilesByUserId/${userid}`)
  }
  viewFileContent(filename:any){
    return this.http.get(`https://localhost:7248/api/File/view/${filename}`,{ responseType: 'text' })
  }
  shareFile(fileShareDetails: any) {
    return this.http.post(`https://localhost:7248/api/ShareFile`,fileShareDetails)
  }
  getSharedFiles(userid:any){
    return this.http.get(`https://localhost:7248/api/ShareFile/${userid}`)
  }
  getrecycleBinFile(userid:any){
    return this.http.get(`https://localhost:7248/api/RecycleBin/listRecycleBin/${userid}`);
  }
  deletefilepermanently(fileId: any) {
    return this.http.delete(`https://localhost:7248/api/RecycleBin/deletePermanently/${fileId}`)
  }  
  restoreFile(fileId: any, restoreDetail: any) {
    return this.http.post(`https://localhost:7248/api/RecycleBin/restoreFromRecycleBin/${fileId}`, restoreDetail)
  } 
  extendRetention(fileId: any, newRetentionDate: any) {
    return this.http.put(`https://localhost:7248/api/File/extendRetention/${fileId}`,newRetentionDate);
}
deleteUser(id:any){
  return this.http.delete(`https://localhost:7248/api/AdminPortal/user/${id}`)
}
getFileByUsername(name:any){
  return this.http.get(`https://localhost:7248/api/AdminPortal/username/${name}`)
}
getFileByDepartment(department:any){
  return this.http.get(`https://localhost:7248/api/AdminPortal/${department}`)
}
getFileByDate(date:any){
  return this.http.get(`https://localhost:7248/api/AdminPortal/date/${date}`)
}
getAllFiles(){
  return this.http.get(`https://localhost:7248/api/File/listFiles`)
}
getUploadedFilesChartData() {
  return this.http.get('https://localhost:7248/api/AdminPortal/total-uploaded-files-by-day');
}
getSharedFilesChartData() {
  return this.http.get(`https://localhost:7248/api/AdminPortal/total-shared-files-by-day`);
}
adminLogin(user: any){
  return this.http.post(`https://localhost:7248/api/AdminPortal/login`,user);
}
getFileContent(fileName:any){
  return this.http.get(`https://localhost:7248/api/File/getFileContent/${fileName}`,{ responseType: 'text' })
}
}
