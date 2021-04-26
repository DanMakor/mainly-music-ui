import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionHomeStaffComponent } from './session-home-staff.component';

describe('SessionHomeStaffComponent', () => {
  let component: SessionHomeStaffComponent;
  let fixture: ComponentFixture<SessionHomeStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionHomeStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionHomeStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
