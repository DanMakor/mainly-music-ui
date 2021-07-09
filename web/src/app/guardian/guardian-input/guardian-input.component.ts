import { Component, OnInit, Optional, Self } from '@angular/core';
import { Validators, FormBuilder, ValidatorFn, AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, ValidationErrors, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Child } from 'src/app/child/child';
import { extractTouchedChanges, getFormGroupValidator } from 'src/app/helpers';
import { InputComponent } from 'src/app/shared/input.component';
import { Guardian } from '../guardian';

@Component({
  selector: 'mm-guardian-input',
  templateUrl: './guardian-input.component.html',
  styleUrls: ['./guardian-input.component.scss']
})
export class GuardianInputComponent extends InputComponent<Guardian> implements OnInit {
  public form = this.fb.group({
    firstName: ["", Validators.required],
    lastName: ["", Validators.required],
    relationshipToChild: [""],
    address: [""],
    phone: [""],
    email: ["", [Validators.email]],
    church: [""],
    drink: [""],
    emergencyContactName: [""],
    emergencyContactPhone: [""]
  });
}
