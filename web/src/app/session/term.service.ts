import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Session } from './session';
import { BehaviorSubject, combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, map, share, shareReplay, skip, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PersonService } from '../person/person.service';
import { Registration } from './registration';
import { Term, TermForCreation } from './term';
import { TermFamily } from './term-family';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private onDestroy$ = new Subject();
  private readonly url = `${environment.api}/terms`;

  private setCurrentTerm$ = new ReplaySubject<string>(1);
  private termsSubject$ = new BehaviorSubject<Term[]>([] as Term[]);
  public terms$ = this.termsSubject$.pipe(
    skip(1),
    map(terms => terms.sort((a, b) => b.year - a.year)),
    shareReplay(1)
  );

  public currentTerm$ = combineLatest([this.setCurrentTerm$, this.terms$]).pipe(
    map(([currentTermId, terms]) => terms.find(term => term._id === currentTermId) as Term),
    filter(currentTerm => !!currentTerm)
  )

  public termsInCurrentYear$ = combineLatest([this.setCurrentTerm$, this.terms$]).pipe(
    map(([currentTermId, terms]) => terms.filter(term => term.year === terms.find(t => t._id === currentTermId)?.year))
  )

  public currentTermFamilies$: Observable<TermFamily[] | undefined> = combineLatest([this.currentTerm$, this.personService.families$]).pipe(
    map(([term, familyMap]) => term?.registrations.map(reg => ({ ...reg, persons: familyMap[reg.familyId] })))
  )

  // public currentTerm$ = new BehaviorSubject<Term>({} as Term);
  // public currentTermPersons$: Observable<TermFamily[]> = combineLatest([this.currentTerm$, this.personService.persons$]).pipe(
  //   map(([term, persons]) => persons.filter(({ familyId }) => term.registrations.some(registration => registration.familyId === familyId))),
  // );

  constructor(private http: HttpClient, private personService: PersonService) {
    merge(
      this.terms$,
      this.setCurrentTerm$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
    
    this.http.get<Term[]>(this.url).pipe(
      tap(terms => this.termsSubject$.next(terms))
    ).subscribe();
  }

  // public get(id: string) {
  //   return this.http.get<Term>(`${this.url}/${id}`).pipe(
  //     tap(session => this.currentSession$.next(session))
  //   )
  // }

  public create(term: TermForCreation): Observable<Term> {
    return this.http.post<{ insertedId: string }>(`${this.url}/create`, term).pipe(
      map(({ insertedId }) => ({ ...term, _id: insertedId, sessions: [], registrations: [] })),
      tap(term => this.termsSubject$.next([ ...this.termsSubject$.getValue(), term ]))
    )
  }

  public register(registration: Registration, termId: string) {
    return this.http.post(`${this.url}/${termId}/register`, registration).pipe(
      tap(_ => this.termsSubject$.next(
        this.termsSubject$.getValue()
          .map(term => term._id === termId ? { ...term, registrations: [ ...term.registrations, registration ]} : term)
        )
      )
    );
  }

  public updateRegistration(registration: Registration, termId: string) {
    return this.http.post(`${this.url}/${termId}/updateRegistration`, registration).pipe(
      tap(_ => this.termsSubject$.next(
        this.termsSubject$.getValue()
          .map(term => term._id === termId ? 
              { ...term, registrations: term.registrations.map(r => r.familyId === registration.familyId ? registration : r )} 
              : term)
        )
      )
    );
  }

  public setCurrentTerm(termId: string) {
    this.setCurrentTerm$.next(termId);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
