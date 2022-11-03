import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPdfFileComponent } from './svg-pdf-file.component';

describe('SvgPdfFileComponent', () => {
  let component: SvgPdfFileComponent;
  let fixture: ComponentFixture<SvgPdfFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgPdfFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgPdfFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
