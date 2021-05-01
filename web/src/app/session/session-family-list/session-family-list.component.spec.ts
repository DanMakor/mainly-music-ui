import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFamilyListComponent } from './session-family-list.component';

describe('SessionFamilyListComponent', () => {
  let component: SessionFamilyListComponent;
  let fixture: ComponentFixture<SessionFamilyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionFamilyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionFamilyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
