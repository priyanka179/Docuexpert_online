import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildDeliveryBibleComponent } from './build-delivery-bible.component';

describe('BuildDeliveryBibleComponent', () => {
  let component: BuildDeliveryBibleComponent;
  let fixture: ComponentFixture<BuildDeliveryBibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildDeliveryBibleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildDeliveryBibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
