import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardtimedashboardComponent } from './hardtimedashboard.component';

describe('HardtimedashboardComponent', () => {
  let component: HardtimedashboardComponent;
  let fixture: ComponentFixture<HardtimedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HardtimedashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HardtimedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
