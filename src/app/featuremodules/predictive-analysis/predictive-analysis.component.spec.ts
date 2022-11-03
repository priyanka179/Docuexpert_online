import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveAnalysisComponent } from './predictive-analysis.component';

describe('PredictiveAnalysisComponent', () => {
  let component: PredictiveAnalysisComponent;
  let fixture: ComponentFixture<PredictiveAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictiveAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
