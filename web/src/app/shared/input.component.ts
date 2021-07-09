import { ChangeDetectorRef, Directive, Optional, Self } from "@angular/core";
import { FormBuilder, FormGroup, NgControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { extractTouchedChanges, getFormGroupValidator } from "../helpers";

@Directive()
export abstract class InputComponent<T> {
    private onDestroy$ = new Subject();
    public onChange: ((_: T) => void) | undefined;
    public onTouched: (() => void) | undefined;

    public abstract form: FormGroup;
    protected defaultValue: Partial<T> = {};

    constructor(protected fb: FormBuilder, @Optional() @Self() public ngControl: NgControl, private cdr: ChangeDetectorRef) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }

    ngOnInit(): void {
        if (this.ngControl && this.ngControl.control) {
            const validators = this.ngControl.control.validator ?
                [this.ngControl.control.validator, getFormGroupValidator(this.form)] :
                [getFormGroupValidator(this.form)];

            this.ngControl.control.setValidators(validators);
            this.ngControl.control.updateValueAndValidity();

            extractTouchedChanges(this.ngControl.control).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
                this.form.markAllAsTouched();
                this.cdr.markForCheck();
            });
        }

        this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(child => {
            if (this.onChange) {
                this.onChange(child)
            }
        })
    }

    writeValue(obj: any): void {
        this.form.reset(obj ? obj : this.defaultValue, { emitEvent: false });
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