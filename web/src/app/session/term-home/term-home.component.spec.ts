import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermHomeComponent } from './term-home.component';

describe('TermHomeComponent', () => {
  let component: TermHomeComponent;
  let fixture: ComponentFixture<TermHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
