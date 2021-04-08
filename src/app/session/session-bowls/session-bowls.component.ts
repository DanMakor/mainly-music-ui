import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'mm-session-bowls',
  templateUrl: './session-bowls.component.html',
  styleUrls: ['./session-bowls.component.scss']
})
export class SessionBowlsComponent implements OnInit {

  constructor(private sessionService: SessionService, private personService: PersonService) { }

  numberOfBowls$ = combineLatest([this.sessionService.currentSession$, this.personService.children$]).pipe(
    map(([currentSession, children]) => children.filter(c => currentSession.personIds.includes(c._id) && c.hasBowl).length)
  )

  ngOnInit(): void {
  }

}
