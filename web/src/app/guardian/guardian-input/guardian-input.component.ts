import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, ValidatorFn, AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Child } from 'src/app/child/child';

@Component({
  selector: 'mm-guardian-input',
  templateUrl: './guardian-input.component.html',
  styleUrls: ['./guardian-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: GuardianInputComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: GuardianInputComponent,
      multi: true
    }
  ]
})
export class GuardianInputComponent implements OnInit {
  private onDestroy$ = new Subject();
  public onChange: ((_: Child) => void) | undefined;
  public onTouched: (() => void) | undefined;

  public guardianForm = this.fb.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    relationshipToChild: [""],
    address: [""],
    suburb: [""],
    state: [""],
    postcode: [""],
    phone: [""],
    email: ["", [Validators.email, Validators.required]],
    church: [""],
    drink: [""],
    information: [""],
    emergencyContactName: [""],
    emergencyContactPhone: [""]
  });
  
  ngOnInit(): void {
    this.guardianForm.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(child => {
      if (this.onChange) {
        this.onChange(child)
      }
    })
  }

  constructor(private fb: FormBuilder) { }

  validate = (): ValidatorFn => (_: AbstractControl) => this.guardianForm.errors;

  writeValue(obj: any): void {
    this.guardianForm.reset(obj ? obj : {}, { emitEvent: false });
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
