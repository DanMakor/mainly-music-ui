import { ChangeDetectionStrategy, Component, OnInit, Optional, Self } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormBuilder, ValidatorFn, AbstractControl, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Child } from 'src/app/child/child';
import { getFormGroupValidator, extractTouchedChanges } from 'src/app/helpers';
import { InputComponent } from 'src/app/shared/input.component';
import { Staff } from '../staff';

@Component({
  selector: 'mm-staff-input',
  templateUrl: './staff-input.component.html',
  styleUrls: ['./staff-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffInputComponent extends InputComponent<Staff> implements OnInit {
  public form = this.fb.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    drink: [""]
  });
}
