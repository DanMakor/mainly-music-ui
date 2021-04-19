import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { getDisplayNameForDrink } from 'src/app/helpers';
import { PersonService } from 'src/app/person/person.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'mm-session-person-drinks',
  templateUrl: './session-person-drinks.component.html',
  styleUrls: ['./session-person-drinks.component.scss']
})
export class SessionPersonDrinksComponent implements OnInit {

  constructor(private sessionService: SessionService, private personService: PersonService) { }

  public drinkNamesAndCount$ = combineLatest([this.sessionService.currentSession$, this.personService.guardians$]).pipe(
    map(([currentSession, guardians]) => Object.entries(guardians
      .filter(g => currentSession.personIds.includes(g._id) && g.drink)
      .reduce((acc, guardian) => { 
        const drinkDisplayName = getDisplayNameForDrink(guardian.drink);
        return { ...acc, [drinkDisplayName]: acc[drinkDisplayName] ? [ ...acc[drinkDisplayName], guardian.firstName + ' ' + guardian.lastName ] : [guardian.firstName + ' ' + guardian.lastName] }
      }, {} as { [key: string]: string[] }))
    ),
  )
  
  ngOnInit(): void {
  }

}
