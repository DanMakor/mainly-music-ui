import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { getDisplayNameForDrink } from 'src/app/helpers';
import { PersonService } from 'src/app/person/person.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'mm-session-drinks',
  templateUrl: './session-drinks.component.html',
  styleUrls: ['./session-drinks.component.scss']
})
export class SessionDrinksComponent implements OnInit {

  constructor(private sessionService: SessionService, private personService: PersonService) { }

  public drinkNamesAndCount$ = combineLatest([this.sessionService.currentSession$, this.personService.guardians$]).pipe(
    map(([currentSession, guardians]) => Object.entries(guardians
      .filter(g => currentSession.personIds.includes(g._id) && g.drink)
      .reduce((acc, guardian) => { 
        const drinkDisplayName = getDisplayNameForDrink(guardian.drink);
        return { ...acc, [drinkDisplayName]: acc[drinkDisplayName] ? ++acc[drinkDisplayName] : 1 }
      }, {} as { [key: string]: number }))
    )
  )

  ngOnInit(): void {
  }

}
