import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffInputComponent } from './staff-input.component';

describe('StaffInputComponent', () => {
  let component: StaffInputComponent;
  let fixture: ComponentFixture<StaffInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
