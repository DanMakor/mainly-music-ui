import { Component, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Guardian } from 'src/app/guardian/guardian';
import { getDisplayNameForDrink } from 'src/app/helpers';
import { PersonService } from 'src/app/person/person.service';
import { Staff } from 'src/app/staff/staff';
import { SessionService } from '../session.service';

@Component({
  selector: 'mm-session-person-drinks',
  templateUrl: './session-person-drinks.component.html',
  styleUrls: ['./session-person-drinks.component.scss']
})
export class SessionPersonDrinksComponent implements OnInit {
  private onDestroy$ = new Subject();

  constructor(private sessionService: SessionService, private personService: PersonService) { }

  public drinkNamesAndCount$ = combineLatest([this.sessionService.currentSession$, this.personService.nonChildren$]).pipe(
    map(([currentSession, guardians]) => Object.entries(guardians
      .filter(g => currentSession.personIds.includes(g._id) && g.drink)
      .reduce((acc, guardian) => { 
        const drinkDisplayName = getDisplayNameForDrink(guardian.drink);
        const guardianName =  guardian.firstName + ' ' + guardian.lastName;
        const sessionStorageValue = sessionStorage.getItem(guardian._id);
        const delivered = sessionStorageValue && JSON.parse(sessionStorageValue);

        return { ...acc, [drinkDisplayName]: acc[drinkDisplayName] ? 
          [ ...acc[drinkDisplayName], { _id: guardian._id, name: guardianName, delivered }] : 
          [{ _id: guardian._id, name: guardianName, delivered }] 
        }
      }, {} as { [key: string]: { _id: string, name: string, delivered: boolean }[] }))
    ),
  )

  public checkboxClicked$ = new Subject<{ _id: string, delivered: boolean }>();
  private setSessionStorageKey$ = this.checkboxClicked$.pipe(
    tap(({ _id, delivered }) => sessionStorage.setItem(_id, JSON.stringify(delivered)))
  )

  ngOnInit(): void {
    this.setSessionStorageKey$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
