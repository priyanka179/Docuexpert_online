import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFolderComponent } from './input-folder.component';

describe('InputFolderComponent', () => {
  let component: InputFolderComponent;
  let fixture: ComponentFixture<InputFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
