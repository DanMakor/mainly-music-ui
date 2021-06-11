import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonBirthdaysComponent } from './person-birthdays.component';

describe('PersonBirthdaysComponent', () => {
  let component: PersonBirthdaysComponent;
  let fixture: ComponentFixture<PersonBirthdaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonBirthdaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonBirthdaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
