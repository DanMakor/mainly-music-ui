import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionReportsComponent } from './session-reports.component';

describe('SessionReportComponent', () => {
  let component: SessionReportsComponent;
  let fixture: ComponentFixture<SessionReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
