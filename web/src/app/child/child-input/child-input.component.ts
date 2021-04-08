import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Child } from '../child';

@Component({
  selector: 'mm-child-input',
  templateUrl: './child-input.component.html',
  styleUrls: ['./child-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ChildInputComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ChildInputComponent,
      multi: true
    }
  ]
})
export class ChildInputComponent implements OnInit, OnDestroy,ControlValueAccessor {
  private onDestroy$ = new Subject();
  public onChange: ((_: Child) => void) | undefined;
  public onTouched: (() => void) | undefined;

  public childForm = this.fb.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    dateOfBirth: ["", Validators.required]
  });
  
  ngOnInit(): void {
    this.childForm.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(child => {
      if (this.onChange) {
        this.onChange(child)
      }
    })
  }

  constructor(private fb: FormBuilder) { }

  validate = (): ValidatorFn => (_: AbstractControl) => this.childForm.errors;

  writeValue(obj: any): void {
    this.childForm.reset(obj ? obj : {}, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
