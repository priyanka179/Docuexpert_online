import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCsvComponent } from './preview-csv.component';

describe('PreviewCsvComponent', () => {
  let component: PreviewCsvComponent;
  let fixture: ComponentFixture<PreviewCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewCsvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
