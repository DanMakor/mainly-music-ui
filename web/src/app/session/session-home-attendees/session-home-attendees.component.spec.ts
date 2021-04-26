import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionHomeAttendeesComponent } from './session-home-attendees.component';

describe('SessionHomeAttendeesComponent', () => {
  let component: SessionHomeAttendeesComponent;
  let fixture: ComponentFixture<SessionHomeAttendeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionHomeAttendeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionHomeAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
