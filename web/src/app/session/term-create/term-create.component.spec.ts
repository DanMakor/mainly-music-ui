import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermCreateComponent } from './term-create.component';

describe('TermCreateComponent', () => {
  let component: TermCreateComponent;
  let fixture: ComponentFixture<TermCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
