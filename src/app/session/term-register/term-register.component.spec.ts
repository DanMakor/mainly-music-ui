import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermRegisterComponent } from './term-register.component';

describe('TermRegisterComponent', () => {
  let component: TermRegisterComponent;
  let fixture: ComponentFixture<TermRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
