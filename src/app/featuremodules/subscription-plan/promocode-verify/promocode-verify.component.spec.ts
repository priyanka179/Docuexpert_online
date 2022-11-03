import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocodeVerifyComponent } from './promocode-verify.component';

describe('PromocodeVerifyComponent', () => {
  let component: PromocodeVerifyComponent;
  let fixture: ComponentFixture<PromocodeVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromocodeVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocodeVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
