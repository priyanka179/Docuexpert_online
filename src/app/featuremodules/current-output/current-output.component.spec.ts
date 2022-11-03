import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOutputComponent } from './current-output.component';

describe('CurrentOutputComponent', () => {
  let component: CurrentOutputComponent;
  let fixture: ComponentFixture<CurrentOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
