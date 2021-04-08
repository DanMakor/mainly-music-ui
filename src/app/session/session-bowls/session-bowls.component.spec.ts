import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionBowlsComponent } from './session-bowls.component';

describe('SessionBowlsComponent', () => {
  let component: SessionBowlsComponent;
  let fixture: ComponentFixture<SessionBowlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionBowlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionBowlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
