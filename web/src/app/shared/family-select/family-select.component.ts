import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl, ValidatorFn, AbstractControl, NgControl } from '@angular/forms';
import { combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, pluck, startWith, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Child } from 'src/app/child/child';
import { Guardian } from 'src/app/guardian/guardian';
import { extractTouchedChanges } from 'src/app/helpers';
import { personType } from 'src/app/person/person-type';

@Component({
  selector: 'mm-family-select',
  templateUrl: './family-select.component.html',
  styleUrls: ['./family-select.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilySelectComponent implements OnInit, ControlValueAccessor {
  public readonly personType = personType;
  private onDestroy$ = new Subject();

  @Output() public allowPhotographs = new EventEmitter<boolean>();

  public onChange: ((_: any) => void) | undefined;
  public onTouched: (() => void) | undefined;

  private writeValue$ =  new ReplaySubject<string>(1);

  private persons$ = new ReplaySubject<(Child | Guardian)[]>(1);

  @Input() set persons(arr: ((Child | Guardian)[] | null)) {
    arr && this.persons$.next(arr);
  }

  public families$: Observable<{ [key: string]: { type: personType, name: string, allowsPhotographs: boolean | undefined }[] }> = this.persons$.pipe(
    map(persons => persons.reduce((acc, person) => acc[person.familyId] ? { 
      ...acc, 
      [person.familyId]: [ ...acc[person.familyId], { allowPhotographs: (person as Child).allowPhotographs, type: person.type, name: person.firstName + " " + person.lastName }].sort((a, b) => a.type - b.type)
    } : { ...acc, [person.familyId]: [{ allowPhotographs: (person as Child).allowPhotographs, type: person.type, name: person.firstName + " " + person.lastName }] }, {} as any)),
  );

  // Really gross but seems more robust... no race condition than just using writeValue$ with withLatestFrom
  private writeInput$ = combineLatest([
    this.writeValue$.pipe(filter(val => !!val)), 
    this.families$.pipe(filter(val => !!Object.keys(val).length), take(1))
  ]).pipe(
    withLatestFrom(this.families$),
    tap(([[familyId, _], personsMap]) => 
      this.familyInput.setValue({ key: familyId, value: personsMap[familyId] }, { emitEvent: false })
    )
  );

  public familyInput = new FormControl();

  public filteredFamilies$ = combineLatest([
    this.familyInput.valueChanges.pipe(
      debounceTime(300), 
      startWith(""),
      map((searchTerm) => searchTerm.value?.map((s: any) => s.name) || searchTerm.split(','))
    ), 
    this.families$
  ]).pipe(
    map(([searchTerm, families]) => Object.entries(families)
      .filter(([_, familyMembers]) => searchTerm.every((st: string) => 
        familyMembers.some(fm => fm.name.trim().toLocaleLowerCase().includes(st.trim().toLocaleLowerCase())))
      )
      .map(([key, value]) => ({ key, value }))
    ),
  )

  private familySelected$ = this.familyInput.valueChanges.pipe(
    tap(({ key }) => this.onChange && this.onChange(key)),
    filter(({ value }) => value),
    tap(({ value }) => this.allowPhotographs.emit(value.find((p: any) => p.allowPhotographs !== undefined).allowPhotographs))
  );

  public displayFn = (item: { key: string, value: { type: string, name: string }[]}) => 
    item?.value.reduce((acc, curr) => (acc ? acc + ", " : acc) + curr.name, "");

  constructor(@Optional() @Self() public ngControl: NgControl, private cdr: ChangeDetectorRef) {
      if (ngControl) {
          ngControl.valueAccessor = this;
      }
  }

  ngOnInit(): void {
    merge(
      this.writeInput$,
      this.familySelected$,
      this.persons$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();

    if (this.ngControl.control) {
      this.familyInput.setValidators(this.ngControl.control.validator);
      this.familyInput.updateValueAndValidity({ emitEvent: false });

      extractTouchedChanges(this.ngControl.control).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
          this.familyInput.markAsTouched();
          this.cdr.markForCheck();
      });
    }
  }

  writeValue(obj: any): void {
    this.writeValue$.next(obj);
  }

  setDisabledState(disabled: boolean) {
    disabled ? this.familyInput.disable({ emitEvent: false }) : this.familyInput.enable({ emitEvent: false })
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
