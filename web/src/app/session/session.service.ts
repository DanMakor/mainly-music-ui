import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { BehaviorSubject, combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, pairwise, share, shareReplay, skip, startWith, switchMap, take, takeUntil, takeWhile, tap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PersonForDisplay } from '../person/person-for-display';
import { PersonService } from '../person/person.service';
import { personType } from '../person/person-type';
import { Session } from './session';
import { TermService } from './term.service';
import { addDays, birthdayIsBetweenSessions } from '../helpers';
import { Child } from '../child/child';
import { Term } from './term';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private onDestroy$ = new Subject();
  private readonly termUrl = `${environment.api}/terms`
  private readonly sessionUrl = 'sessions';

  private sessionsSubject$ = new BehaviorSubject<{ [key: string]: Session }>({});
  public sessionsMap$ = this.sessionsSubject$.asObservable().pipe(
    skip(1),
    shareReplay(1)
  );
  private setCurrentSession$ = new ReplaySubject<string>(1);

  public currentSession$ = combineLatest([this.sessionsMap$, this.setCurrentSession$]).pipe(
    map(([sessionsMap, currentSessionId]) => sessionsMap[currentSessionId]),
    filter(currentSession => !!currentSession),
  );

  public currentSessionBirthdaysMap$ = this.currentSession$.pipe(
    startWith({} as Session),
    pairwise(),
    filter(([session, currentSession]) => session._id !== currentSession._id),
    switchMap(([_, currentSession]) => this.termService.termsInCurrentYear$.pipe(
      take(1),
      map(terms => ({ currentSession, terms }))
    )),
    switchMap((sessionAndTerms) => this.personService.children$.pipe(
      take(1),
      map(children => ({ ...sessionAndTerms, children }))
    )),
    withLatestFrom(this.sessionsMap$),
    map(([{ currentSession, terms, children }, sessionsMap]) => {
      const sessions = Object.values(sessionsMap);
      const sortedSessions = sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const index = sortedSessions.findIndex(s => s._id === currentSession._id);
      const previousSessionDate = index === 0 || terms.find(t => t._id === sortedSessions[index].termId)?.termNumber !== 4 ? 
        addDays(currentSession.date, -14) :
        sortedSessions[index - 1].date;

      const birthdaysMap = children.reduce((acc, child) => ({ ...acc, [child._id]: birthdayIsBetweenSessions(child.dateOfBirth, currentSession.date, previousSessionDate)}), {} as { [key: string]: boolean });
      return { sessionId: currentSession._id, birthdaysMap };
    }),
    share()
  );

  public attendanceMap$ = combineLatest([this.currentSession$, this.termService.termsInCurrentYear$]).pipe(
    withLatestFrom(this.sessionsMap$),
    map(([[currentSession, terms], sessionsMap]) => {
      return Object.values(sessionsMap).filter(s => terms.some(t => t._id === s.termId))
        .reduce((acc, session) => {
          let attendanceMap = { ...acc }
          session.personIds.forEach(personId => 
             attendanceMap = ({ ...attendanceMap, [personId]: attendanceMap[personId] ? [ ...attendanceMap[personId], session._id ] : [session._id] })
          );
          return attendanceMap;
        }, {} as { [key: string]: string[] })
    }),
    share()
  );

  private getCurrentTermYearSessions$ = this.termService.currentTerm$.pipe(
    map(term => (term as Term).year),
    startWith(new Date().getFullYear()),
    distinctUntilChanged(),
    switchMap(year => this.getSessionsForYear(year))
  )

  constructor(
    private http: HttpClient, 
    private personService: PersonService, 
    private termService: TermService,
    private socket: Socket
  ) {
    this.socket.on('sessionupdated', (session: Session) => {
      const sessions = this.sessionsSubject$.getValue();
      this.sessionsSubject$.next({ ...sessions, [session._id]: session })
    });

    merge(
      this.sessionsMap$,
      this.setCurrentSession$,
      this.getCurrentTermYearSessions$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  public create(termId: string): Observable<Session> {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return this.http.post<{ insertedId: string }>(`${this.termUrl}/${termId}/${this.sessionUrl}/create`, { date }).pipe(
      map((result) => ({ 
        date, 
        _id: result.insertedId, 
        personIds: [], 
        termId,
        termNumber: 4
      })),
      tap(session => this.sessionsSubject$.next({ ...this.sessionsSubject$.getValue(), [session._id]: session }))
    )
  }

  public checkIn(termId: string, sessionId: string, personId: string): Observable<any> {
    return this.http.post<any>(`${this.termUrl}/${termId}/${this.sessionUrl}/${sessionId}/checkIn`, { personId }).pipe(
      tap(_ => {
        const sessions = this.sessionsSubject$.getValue();
        this.socket.emit('sessionupdated', { ...sessions[sessionId], personIds: [ ...sessions[sessionId].personIds, personId ]});
      })
    );
  }

  public checkOut(termId: string, sessionId: string, personId: string): Observable<any> {
    return this.http.post<any>(`${this.termUrl}/${termId}/${this.sessionUrl}/${sessionId}/checkOut`, { personId }).pipe(
      tap(_ => {
        const sessions = this.sessionsSubject$.getValue();
        this.socket.emit('sessionupdated', { ...sessions[sessionId], personIds: sessions[sessionId].personIds.filter(pId => pId !== personId) });
      })
    );
  }

  public getSessionsForYear(year: number) {
    return this.http.get<Session[]>(`${environment.api}/${this.sessionUrl}?year=${year}`).pipe(
      tap(sessions => {
        const currentSessionsMap = this.sessionsSubject$.getValue();
        this.sessionsSubject$.next(
          sessions.reduce((acc, sess) => ({ ...acc, [sess._id]: sess }), currentSessionsMap)
        );
      })
    )
  }

  public setCurrentSession(sessionId: string): void {
    this.setCurrentSession$.next(sessionId);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
