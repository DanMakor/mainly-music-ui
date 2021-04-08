import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDrinksComponent } from './session-drinks.component';

describe('SessionDrinksComponent', () => {
  let component: SessionDrinksComponent;
  let fixture: ComponentFixture<SessionDrinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionDrinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionDrinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
