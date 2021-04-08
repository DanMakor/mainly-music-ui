import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkInputComponent } from './drink-input.component';

describe('DrinkInputComponent', () => {
  let component: DrinkInputComponent;
  let fixture: ComponentFixture<DrinkInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrinkInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
