import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmation.ModalComponent } from './confirmation.modal.component';

describe('Confirmation.ModalComponent', () => {
  let component: Confirmation.ModalComponent;
  let fixture: ComponentFixture<Confirmation.ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Confirmation.ModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Confirmation.ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
