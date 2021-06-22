import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { LeftSidenavService } from 'src/app/left-sidenav.service';
import { SessionToolbarService } from '../session-toolbar/session-toolbar.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'mm-session-birthdays-and-certificates',
  templateUrl: './session-birthdays-and-certificates.component.html',
  styleUrls: ['./session-birthdays-and-certificates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionBirthdaysAndCertificatesComponent implements OnInit {
  constructor(
    private sessionService: SessionService, 
    private personService: PersonService, 
    private leftSidenavService: LeftSidenavService,
    private sessionToolbarService: SessionToolbarService
  ) { }

  public certificates$ = combineLatest([this.sessionService.attendanceMap$, this.personService.children$, this.sessionService.currentSession$]).pipe(
    map(([attendanceMap, persons, currentSession]) => persons.filter(p => attendanceMap[p._id]?.length === 10 && currentSession.personIds.includes(p._id)))
  );

  public birthdays$ = combineLatest([this.sessionService.currentSessionBirthdaysMap$, this.personService.children$, this.sessionService.currentSession$]).pipe(
    map(([{ birthdaysMap }, persons, currentSession]) => persons.filter(p => birthdaysMap[p._id] && currentSession.personIds.includes(p._id)))
  )

  ngOnInit(): void {
    this.sessionToolbarService.hide();
    this.leftSidenavService.close();
  }

  ngOnDestroy() {
    this.sessionToolbarService.show();
    this.leftSidenavService.open();
  }
}
