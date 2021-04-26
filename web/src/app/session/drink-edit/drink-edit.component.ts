import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router,  } from '@angular/router';
import { Location } from '@angular/common';
import { merge, Subject } from 'rxjs';
import { exhaustMap, filter, map, share, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { PersonService } from '../../person/person.service';
import { Guardian } from 'src/app/guardian/guardian';
import { Staff } from 'src/app/staff/staff';

@Component({
  selector: 'app-drink-edit',
  templateUrl: './drink-edit.component.html',
  styleUrls: ['./drink-edit.component.scss']
})
export class DrinkEditComponent implements OnInit, OnDestroy {
  private readonly id = this.route.snapshot.paramMap.get('personId') as string;
  private onDestroy$ = new Subject();
  public drink = new FormControl();
  public saveDrinkClicked$ = new Subject();

  public person$ = this.personService.persons$.pipe(
    map(persons => persons.find(person => person._id === this.id) as (Guardian | Staff)),
    shareReplay(1)
  );

  public title$ = this.person$.pipe(
    map(person => `Edit drink for ${person.firstName}`)
  )

  private setDrink$ = this.person$.pipe(
    map(person => person.drink),
    filter(drink => !!drink),
    tap(drink => this.drink.reset(drink))
  );

  private updateDrink$ = this.saveDrinkClicked$.pipe(
    filter(_ => this.drink.valid),
    tap(_ => console.log(this.drink.value)),
    exhaustMap(_ => this.personService.updateDrink(this.id, this.drink.value).pipe(
        catchAndContinue()
      )
    ),
    filter(({ isError}) => !isError),
    tap(_ => this.location.back())
  )

  constructor(
    private personService: PersonService, 
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    merge(
      this.setDrink$,
      this.updateDrink$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
