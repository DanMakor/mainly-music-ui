import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardianInputComponent } from './guardian-input.component';

describe('GuardianInputComponent', () => {
  let component: GuardianInputComponent;
  let fixture: ComponentFixture<GuardianInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuardianInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardianInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
