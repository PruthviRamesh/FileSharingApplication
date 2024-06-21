import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrl: './user-portal.component.css'
})
export class UserPortalComponent {
  currentUser: any; 
  activeTab = 'upload-files';
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
  signOut(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
    this.router.navigate(['/signin']);
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
