import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router,  } from '@angular/router';
import { Location } from '@angular/common';
import { merge, Subject } from 'rxjs';
import { exhaustMap, filter, map, share, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { PersonService } from '../../person/person.service';
import { Guardian } from 'src/app/guardian/guardian';

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

  public guardian$ = this.personService.guardians$.pipe(
    map(persons => persons.find(person => person._id === this.id) as Guardian),
    shareReplay(1)
  );

  public title$ = this.guardian$.pipe(
    map(guardian => `Edit drink for ${guardian.firstName}`)
  )

  private setDrink$ = this.guardian$.pipe(
    map(guardian => guardian.drink),
    filter(drink => !!drink),
    tap(drink => this.drink.reset(drink))
  );

  private updateDrink$ = this.saveDrinkClicked$.pipe(
    filter(_ => this.drink.valid),
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
