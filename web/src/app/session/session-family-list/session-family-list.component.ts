import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Child } from 'src/app/child/child';
import { Guardian } from 'src/app/guardian/guardian';
import { PersonForDisplay } from 'src/app/person/person-for-display';
import { personType } from 'src/app/person/person-type';
import { PersonService } from 'src/app/person/person.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'mm-session-family-list',
  templateUrl: './session-family-list.component.html',
  styleUrls: ['./session-family-list.component.scss']
})
export class SessionFamilyListComponent implements OnInit {
  public personType = personType;
  constructor(private sessionService: SessionService, private personService: PersonService) { }

  public sessionFamilies$ = combineLatest([this.sessionService.currentSession$, this.personService.persons$]).pipe(
    map(([session, persons]) => Object.values((persons as (Child | Guardian)[])
        .filter(p => session.personIds.includes(p._id) && p.type !== personType.staff)
        .sort((a, b) => a.lastName.localeCompare(b.lastName))
        .reduce((acc, person) => ({
          ...acc,
          [person.familyId]: acc[person.familyId] ? [ ...acc[person.familyId], person ] : [person]  
        }), {} as { [key: string]: (Child | Guardian)[] })
      ).map(persons => persons.sort((a, b) => a.type - b.type))
    )
  );

  ngOnInit(): void {
  }
}
