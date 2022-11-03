import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkUploadAuthSuccessComponent } from './link-upload-auth-success.component';

describe('LinkUploadAuthSuccessComponent', () => {
  let component: LinkUploadAuthSuccessComponent;
  let fixture: ComponentFixture<LinkUploadAuthSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkUploadAuthSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkUploadAuthSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
