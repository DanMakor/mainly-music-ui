import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { RightSidenavService } from 'src/app/right-sidenav.service';
import { SessionService } from '../session.service';
import { TermService } from '../term.service';
import { SessionToolbarService } from './session-toolbar.service';

@Component({
  selector: 'mm-session-toolbar',
  templateUrl: './session-toolbar.component.html',
  styleUrls: ['./session-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionToolbarComponent implements OnInit {

  constructor(
    private termService: TermService, 
    private sessionService: SessionService, 
    private sessionToolbarService: SessionToolbarService,
    private personService: PersonService,
    private rightSidenavService: RightSidenavService
  ) { }

  public showToolbar$ = this.sessionToolbarService.showToolbar$;

  public currentTerm$ = this.termService.currentTerm$
  public currentSession$ = combineLatest([this.termService.currentTerm$, this.sessionService.currentSession$]).pipe(
    map(([currentTerm, currentSession]) => currentTerm._id === currentSession.termId ? currentSession : null)
  );

  private childrenInSession$ = combineLatest([this.currentSession$, this.personService.children$]).pipe(
    map(([session, children]) => {
      if (!session) {
        return null;
      }
      return children.filter(c => session.personIds.includes(c._id))
    })
  );

  public numberOfChildren$ = this.childrenInSession$.pipe(
    map((children) => {
      if (!children) {
        return null;
      }
      return children.length
    })
  );

  public numberOfBowls$ = this.childrenInSession$.pipe(
    map((children) => {
      if (!children) {
        return null;
      }

      return children.filter(c => c.hasBowl).length
    })
  );

  public numberOfGuardians$ = combineLatest([this.currentSession$, this.personService.guardians$]).pipe(
    map(([session, guardians]) => {
      if (!session) {
        return null;
      }
      return guardians.filter(c => session.personIds.includes(c._id)).length
    })
  );

  toggleSidenav() {
    this.rightSidenavService.toggle();
  }

  ngOnInit(): void {
  }
}
