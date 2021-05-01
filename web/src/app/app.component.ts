import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { combineLatest, Subject } from 'rxjs';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { LoadingService } from './core/loading.service';
import { datesAreEqual } from './helpers';
import { Session } from './session/session';
import { SessionService } from './session/session.service';
import { Term } from './session/term';
import { TermService } from './session/term.service';
import { LeftSidenavService } from './left-sidenav.service';
import { RightSidenavService } from './right-sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @ViewChild('leftSidenav', { static: true }) leftSidenav!: MatSidenav;
  @ViewChild('rightSidenav', { static: true }) rightSidenav!: MatSidenav;

  private onDestroy$ = new Subject();

  public showProgressBar$ = this.loadingService.isLoading$;

  private setCurrentSessionIfThereIsASessionForToday$ = combineLatest([
    this.sessionService.sessionsMap$,
    this.termService.terms$
  ]).pipe(
    take(1),
    map(([sessionsMap, terms]) => ({
        session: Object.values(sessionsMap).find(session => datesAreEqual(session.date, new Date())),
        terms
      })
    ),
    filter(({ session }) => !!session),
    tap(({ session, terms }) => {
      const term = terms.find(t => t._id === (session as Session).termId) as Term;
      this.termService.setCurrentTerm(term._id);
      this.sessionService.setCurrentSession((session as Session)._id);
    })
  );

  constructor(
    private leftSidenavService: LeftSidenavService, 
    private rightSidenavService: RightSidenavService,
    private loadingService: LoadingService, 
    private sessionService: SessionService, 
    private termService: TermService
  ) {}

  public ngOnInit(): void {
    this.setCurrentSessionIfThereIsASessionForToday$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngAfterViewInit(): void {
    this.leftSidenavService.setSidenav(this.leftSidenav)
    this.rightSidenavService.setSidenav(this.rightSidenav)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
