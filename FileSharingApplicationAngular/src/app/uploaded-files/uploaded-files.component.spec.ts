import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedFilesComponent } from './uploaded-files.component';

describe('UploadedFilesComponent', () => {
  let component: UploadedFilesComponent;
  let fixture: ComponentFixture<UploadedFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadedFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadedFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
