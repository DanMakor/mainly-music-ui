import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Child } from 'src/app/child/child';

@Component({
  selector: 'mm-staff-input',
  templateUrl: './staff-input.component.html',
  styleUrls: ['./staff-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: StaffInputComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: StaffInputComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffInputComponent implements OnInit {
  private onDestroy$ = new Subject();
  public onChange: ((_: Child) => void) | undefined;
  public onTouched: (() => void) | undefined;

  public staffMemberForm = this.fb.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    drink: [""]
  });
  
  ngOnInit(): void {
    this.staffMemberForm.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(staffMember => {
      if (this.onChange) {
        this.onChange(staffMember)
      }
    })
  }

  constructor(private fb: FormBuilder) { }

  validate = (): ValidatorFn => (_: AbstractControl) => this.staffMemberForm.errors;

  writeValue(obj: any): void {
    this.staffMemberForm.reset(obj ? obj : {}, { emitEvent: false });
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
