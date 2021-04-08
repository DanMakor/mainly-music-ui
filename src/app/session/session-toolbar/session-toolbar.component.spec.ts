import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionToolbarComponent } from './session-toolbar.component';

describe('SessionToolbarComponent', () => {
  let component: SessionToolbarComponent;
  let fixture: ComponentFixture<SessionToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
