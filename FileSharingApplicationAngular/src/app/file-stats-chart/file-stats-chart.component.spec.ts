import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStatsChartComponent } from './file-stats-chart.component';

describe('FileStatsChartComponent', () => {
  let component: FileStatsChartComponent;
  let fixture: ComponentFixture<FileStatsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileStatsChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileStatsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
