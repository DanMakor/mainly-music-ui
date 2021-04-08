import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionPersonDrinksComponent } from './session-person-drinks.component';

describe('SessionPersonDrinksComponent', () => {
  let component: SessionPersonDrinksComponent;
  let fixture: ComponentFixture<SessionPersonDrinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionPersonDrinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionPersonDrinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
