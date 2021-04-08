import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildCreateComponent } from './child-create.component';

describe('ChildCreateComponent', () => {
  let component: ChildCreateComponent;
  let fixture: ComponentFixture<ChildCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
