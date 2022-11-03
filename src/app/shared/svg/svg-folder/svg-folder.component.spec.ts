import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgFolderComponent } from './svg-folder.component';

describe('SvgFolderComponent', () => {
  let component: SvgFolderComponent;
  let fixture: ComponentFixture<SvgFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SvgFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
