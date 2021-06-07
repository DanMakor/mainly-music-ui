import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { getDisplayNameForDrink, getOrderBasedOnDrinks } from 'src/app/helpers';
import { PersonService } from 'src/app/person/person.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'mm-session-drinks',
  templateUrl: './session-drinks.component.html',
  styleUrls: ['./session-drinks.component.scss']
})
export class SessionDrinksComponent implements OnInit {

  constructor(private sessionService: SessionService, private personService: PersonService) { }

  public drinkNamesAndCount$ = combineLatest([this.sessionService.currentSession$, this.personService.nonChildren$]).pipe(
    map(([currentSession, guardians]) => Object.entries(guardians
      .filter(g => currentSession.personIds.includes(g._id) && g.drink)
      .sort(getOrderBasedOnDrinks)
      .reduce((acc, guardian) => { 
        const drinkDisplayName = getDisplayNameForDrink(guardian.drink);
        return { ...acc, [drinkDisplayName]: acc[drinkDisplayName] ? ++acc[drinkDisplayName] : 1 }
      }, {} as { [key: string]: number }))
    )
  );

  // public currentSessionStaffMembers$ = combineLatest([this.sessionService.currentSession$, this.personService.staffMembers$]).pipe(
  //   map(([currentSession, staffMembers]) => staffMembers
  //     .filter(staffMember => currentSession.personIds.includes(staffMember._id))
  //     .map(staffMember => ({ ...staffMember, drink: getDisplayNameForDrink(staffMember.drink) }))
  //   )
  // );

  ngOnInit(): void {
  }
}
