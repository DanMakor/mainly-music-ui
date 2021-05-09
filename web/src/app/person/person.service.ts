import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, share, shareReplay, skip, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Child, ChildForCreation } from '../child/child';
import { FamilyForCreation } from '../family/family';
import { Guardian, GuardianForCreation } from '../guardian/guardian';
import { Drink } from '../drink/drink';
import { personType } from './person-type';
import { Socket } from 'ngx-socket-io';
import { Staff } from '../staff/staff';

interface FamilyMap {
  [key: string]: (Child | Guardian)[]
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private onDestroy$ = new Subject();

  private readonly url = environment.api + "/persons";
  private personsSubject$ = new BehaviorSubject<(Guardian | Child | Staff)[]>([]);
  public persons$ = this.personsSubject$.pipe(
    skip(1),
    shareReplay(1)
  );

  public attendees$ = this.persons$.pipe(
    map(persons => persons.filter(person => person.type !== personType.staff) as (Child | Guardian)[]),
  );

  public staffMembers$ = this.persons$.pipe(
    map(persons => persons.filter(person => person.type === personType.staff) as Staff[])
  )

  public guardians$: Observable<Guardian[]> = this.persons$.pipe(
    map(persons => persons.filter(person => person.type === personType.guardian) as Guardian[])
  )

  public children$: Observable<Child[]> = this.persons$.pipe(
    map(persons => persons.filter(person => person.type === personType.child) as Child[])
  )

  public nonChildren$: Observable<(Staff | Guardian)[]> = this.persons$.pipe(
    map(persons => persons.filter(person => person.type !== personType.child) as (Staff | Guardian)[])
  );

  public families$: Observable<FamilyMap> = this.attendees$.pipe(
    map(persons => persons.reduce((acc, person) => acc[person.familyId] ? { 
        ...acc, 
        [person.familyId]: [ ...acc[person.familyId], person].sort((a, b) => a.type - b.type)
      } : { ...acc, [person.familyId]: [person] }, {} as FamilyMap)
    )
  );

  constructor(private http: HttpClient, private socket: Socket) {
    this.socket.on('personupdated', (person: (Child | Guardian | Staff)) => {
      if (person.type === personType.child) {
        person = { ...person, dateOfBirth: new Date((person as Child).dateOfBirth) }
      }
      const persons = this.personsSubject$.getValue();
      this.personsSubject$.next(persons.map(p => p._id === person._id ? person : p))
    });
    
    this.persons$.pipe(takeUntil(this.onDestroy$)).subscribe();
    this.list().subscribe();
  }

  public list(): Observable<(Child | Guardian)[]> {
    return this.http.get<(Child | Guardian)[]>(this.url).pipe(
      tap(persons => this.personsSubject$.next(
        persons.map(p => (p as Child).dateOfBirth ? { ...p, dateOfBirth: new Date((p as Child).dateOfBirth) }: p))
      )
    );
  }

  public updateDrink(personId: string, drink: Drink): Observable<Guardian> {
    return this.http.put<Guardian>(`${this.url}/${personId}/drink`, { drink }).pipe(
      tap(_ => {
        const persons = this.personsSubject$.getValue();
        this.socket.emit('personupdated', ({ ...persons.find(p => p._id === personId), drink: drink ? { ...drink } : null }))
      })
    );
  }

  public updateHasBowl(personId: string, hasBowl: boolean): Observable<Child> {
    return this.http.put<Child>(`${this.url}/${personId}/hasBowl`, { hasBowl }).pipe(
      tap(_ => {
        const persons = this.personsSubject$.getValue();
        this.socket.emit('personupdated', ({ ...persons.find(p => p._id === personId), hasBowl }))
      })
    );  
  }

  public updatePerson(personId: string, { _id, ...personWithNoId }: Child | Staff | Guardian) {
    return this.http.put<any>(`${this.url}/${personId}`, personWithNoId).pipe(
      tap(_ => {
        this.socket.emit('personupdated', { _id, ...personWithNoId })
      })
    );  
  }

  public createChild(child: ChildForCreation, familyId: string) {
    return this.http.post<{ ops: Child[] }>(`${this.url}/createChild`, { ...child, familyId }).pipe(
      tap((response) => this.personsSubject$.next([...this.personsSubject$.getValue(), ...response.ops]))
    )
  }

  public createGuardian(child: GuardianForCreation, familyId: string) {
    return this.http.post<{ ops: Child[] }>(`${this.url}/createGuardian`, { ...child, familyId }).pipe(
      tap((response) => this.personsSubject$.next([...this.personsSubject$.getValue(), ...response.ops]))
    )
  }

  public createStaffMember(staffMember: Staff) {
    return this.http.post<{ ops: Child[] }>(`${this.url}/createStaffMember`, staffMember).pipe(
      tap((response) => this.personsSubject$.next([...this.personsSubject$.getValue(), ...response.ops]))
    )
  }

  public createFamily(family: FamilyForCreation) {
    return this.http.post<{ ops: (Child | Guardian)[] }>(`${this.url}/createFamily`, family).pipe(
      tap((response) => this.personsSubject$.next([...this.personsSubject$.getValue(), ...response.ops]))
    );
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
