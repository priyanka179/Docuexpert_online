import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTxtComponent } from './preview-txt.component';

describe('PreviewTxtComponent', () => {
  let component: PreviewTxtComponent;
  let fixture: ComponentFixture<PreviewTxtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewTxtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTxtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
