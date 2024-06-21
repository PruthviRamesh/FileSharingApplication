import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-shared-files',
  templateUrl: './shared-files.component.html',
  styleUrls: ['./shared-files.component.css']
})
export class SharedFilesComponent implements OnInit {
  sharedFiles: any[] = [];
  userId: any;
  currentUser: any;
  languages: any[] = [];

  private googleApiKey = 'AIzaSyDxqrgXvDHicIKeJ9aMQlm5b2Djx-4SKtc'; 
  private googleTranslateApiUrl = 'https://translation.googleapis.com/language/translate/v2';

  constructor(private fileService: FileService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const email = localStorage.getItem('email');

    if (email) {
      this.fileService.getUserByEmail(JSON.parse(email)).subscribe(
        (data: any) => {
          this.userId = data.userId;
          this.fetchSharedFiles();
        },
        (error) => {
          console.error('Failed to fetch user by email:', error);
        }
      );
    }

    this.fetchSupportedLanguages();
  }

  fetchSharedFiles(): void {
    if (this.userId) {
      this.fileService.getSharedFiles(this.userId).subscribe(
        (response: any) => {
          this.sharedFiles = response.map((file: any) => ({
            ...file,
            selectedLanguage: ''  
          }));
        },
        (error) => {
          console.error('Failed to fetch shared files:', error);
        }
      );
    }
  }

  fetchSupportedLanguages(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const params = new HttpParams()
      .set('key', this.googleApiKey)
      .set('target', 'en'); 

    this.http.get<any>(`${this.googleTranslateApiUrl}/languages`, { headers, params })
      .subscribe((response: any) => {
        this.languages = response.data.languages.map((lang: any) => ({
          value: lang.language,
          viewValue: lang.name
        }));
      }, (error) => {
        console.error('Failed to fetch supported languages:', error);
      });
  }

  isImageFile(filename: string): boolean {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    return imageExtensions.includes(filename.substring(filename.lastIndexOf('.')).toLowerCase());
  }

  isTextFile(filename: string): boolean {
    const textExtensions = ['.txt', '.pdf'];
    return textExtensions.includes(filename.substring(filename.lastIndexOf('.')).toLowerCase());
  }

  isVideoFile(filename: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv'];
    return videoExtensions.includes(filename.substring(filename.lastIndexOf('.')).toLowerCase());
  }

  viewFileContent(file: any): void {
    if (this.isImageFile(file.filename) || this.isVideoFile(file.filename) || this.isTextFile(file.filename)) {
      window.open(file.filePath, '_blank');
    } else {
      console.log(`Unsupported file type: ${file.filename}`);
    }
  }

  translateFile(file: any): void {
    this.fileService.getFileContent(file.filename).subscribe(
      (content: any) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });

        const params = new HttpParams()
          .set('key', this.googleApiKey)
          .set('q', content)
          .set('target', file.selectedLanguage);  

        this.http.post<any>(`${this.googleTranslateApiUrl}`, null, { headers, params })
          .subscribe((response: any) => {
            file.translatedContent = response.data.translations[0].translatedText;
          }, (error) => {
            console.error('Translation failed:', error);
          });
      },
      (error) => {
        console.error('Failed to fetch file content:', error);
      }
    );
  }

  signOut(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
    this.router.navigate(['/signin']);
  }
}

