import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionBirthdaysAndCertificatesComponent } from './session-birthdays-and-certificates.component';

describe('SessionBirthdaysAndCertificatesComponent', () => {
  let component: SessionBirthdaysAndCertificatesComponent;
  let fixture: ComponentFixture<SessionBirthdaysAndCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionBirthdaysAndCertificatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionBirthdaysAndCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
