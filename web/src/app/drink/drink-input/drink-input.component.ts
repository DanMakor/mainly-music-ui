import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { combineLatest, merge, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';
import { Drink } from '../drink';
import { drinkType } from './drink-type';

@Component({
  selector: 'mm-drink-input',
  templateUrl: './drink-input.component.html',
  styleUrls: ['./drink-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DrinkInputComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: DrinkInputComponent,
      multi: true
    }
  ]
})
export class DrinkInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private onDestroy$ = new Subject();
  public readonly drinkType = drinkType;
  public onChange: ((_: Drink) => void) | undefined;
  public onTouched: (() => void) | undefined;
  private writeValue$ = new ReplaySubject<Drink>(1);

  writeType$ = this.writeValue$.pipe(map(drink => drink?.type))
  writeName$ = this.writeValue$.pipe(map(drink => drink?.name))

  private readonly drinks = [
    { name: "Cappuccino", type: drinkType.coffee },
    { name: "Flat White", type: drinkType.coffee },
    { name: "Latte", type: drinkType.coffee },
    { name: "Long Black", type: drinkType.coffee },
    { name: "Short Black", type: drinkType.coffee },
    { name: "Standard Tea", type: drinkType.tea },
    { name: "Rooibos", type: drinkType.tea },
    { name: "Hot", type: drinkType.water },
    { name: "Cold", type: drinkType.water }
  ]

  public readonly milkTypes = [
    { name: "Full Cream", type: drinkType.coffee },
    { name: "Almond", type: drinkType.coffee },
    { name: "No Milk", type: drinkType.tea },
    { name: "My own milk", type: drinkType.coffee }
  ];

  public readonly strengths = [
    "Full",
    "1/2",
    "1/4"
  ];

  public drinkForm = this.fb.group({
    type: ["", Validators.required],
    name: ["", Validators.required],
    strength: [this.strengths[0], Validators.required], 
    milk: [this.milkTypes[0], Validators.required],
    notes: [""]
  });

  private resetDrinkName$ = (this.drinkForm.get('type') as FormControl).valueChanges.pipe(
    tap(_ => this.drinkForm.get('name')?.reset())
  );

  public drinks$ = merge(
    (this.drinkForm.get('type') as FormControl).valueChanges,
    this.writeType$
  ).pipe(
    map(type => this.drinks.filter(drink => drink.type === type)),
    map(drinks => drinks.map(({ name }) => name))
  );

  public milks$ = combineLatest([
    merge((this.drinkForm.get('type') as FormControl).valueChanges, this.writeType$),
    merge((this.drinkForm.get('name') as FormControl).valueChanges, this.writeName$)
  ]).pipe(
    map(([type, name]) => type !== drinkType.water && type !== drinkType.none && type !== undefined && (name !== "Long Black" && name !== "Short Black") 
      ? this.milkTypes.filter(mt => mt.type === drinkType.tea ? mt.type === type : true).map(({ name }) => name) 
      : []
    ),
    tap(milks => {
      if (!milks.length) {
        this.drinkForm.get('milk')?.reset(null, { emitEvent: false })
      } else if (!milks.includes(this.drinkForm.get('milk')?.value)) {
        this.drinkForm.get('milk')?.reset(this.milkTypes[0].name, { emitEvent: false });
      }
    })
  );

  public strengths$ = merge((this.drinkForm.get('type') as FormControl).valueChanges, this.writeType$).pipe(
    map((type) => type === drinkType.coffee ? this.strengths : []),
    tap(strengths => !strengths.length && this.drinkForm.get('strength')?.reset(this.strengths[0], { emitEvent: false }))
  );

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    merge(
      this.writeValue$,
      this.resetDrinkName$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
    this.drinkForm.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(drink => {
      if (this.onChange) { 
        this.onChange(drink.type === drinkType.none ? null : { ...drink, strength: drink.strength === "Full" ? null : drink.strength }); }
    });
  }

  validate = (): ValidatorFn => 
    (_: AbstractControl) => this.drinkForm.errors

  writeValue(obj: any): void {
    const drink = obj && { ...obj, strength: !obj?.strength ? this.strengths[0] : obj?.strength };
    this.drinkForm.reset(drink ? drink : { type: drinkType.none }, { emitEvent: false });
    this.writeValue$.next(obj);
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
