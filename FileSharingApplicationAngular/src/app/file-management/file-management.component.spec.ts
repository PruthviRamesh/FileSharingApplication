import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementComponent } from './file-management.component';

describe('FileManagementComponent', () => {
  let component: FileManagementComponent;
  let fixture: ComponentFixture<FileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
