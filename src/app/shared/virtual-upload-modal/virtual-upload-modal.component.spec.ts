import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualUploadModalComponent } from './virtual-upload-modal.component';

describe('VirtualUploadModalComponent', () => {
  let component: VirtualUploadModalComponent;
  let fixture: ComponentFixture<VirtualUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualUploadModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
