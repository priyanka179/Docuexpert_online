import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AircraftMetadataComponent } from './aircraft-metadata.component';

describe('AircraftMetadataComponent', () => {
  let component: AircraftMetadataComponent;
  let fixture: ComponentFixture<AircraftMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AircraftMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AircraftMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
