import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, NgControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getFormGroupValidator, extractTouchedChanges } from 'src/app/helpers';
import { InputComponent } from 'src/app/shared/input.component';
import { Child } from '../child';

@Component({
  selector: 'mm-child-input',
  templateUrl: './child-input.component.html',
  styleUrls: ['./child-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildInputComponent extends InputComponent<Child> implements OnInit, OnDestroy,ControlValueAccessor {
  public form = this.fb.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    dateOfBirth: [""],
    allergies: [""],
    hasBowl: [true, Validators.required]
  });

  protected defaultValue = { hasBowl: true };
}
