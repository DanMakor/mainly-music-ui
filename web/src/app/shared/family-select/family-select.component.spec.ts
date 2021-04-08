import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySelectComponent } from './family-select.component';

describe('FamilySelectComponent', () => {
  let component: FamilySelectComponent;
  let fixture: ComponentFixture<FamilySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilySelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
