import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderTreeviewComponent } from './folder-treeview.component';

describe('FolderTreeviewComponent', () => {
  let component: FolderTreeviewComponent;
  let fixture: ComponentFixture<FolderTreeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderTreeviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
