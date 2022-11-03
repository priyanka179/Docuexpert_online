import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildDeliveryBible2Component } from './build-delivery-bible2.component';

describe('BuildDeliveryBible2Component', () => {
  let component: BuildDeliveryBible2Component;
  let fixture: ComponentFixture<BuildDeliveryBible2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildDeliveryBible2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDeliveryBible2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
