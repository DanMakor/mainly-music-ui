import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { debounceTime, exhaustMap, filter, map, mapTo, mergeMap, share, startWith, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Guardian } from 'src/app/guardian/guardian';
import { getDisplayNameForDrink } from 'src/app/helpers';
import { PersonForDisplay } from 'src/app/person/person-for-display';
import { personType } from 'src/app/person/person-type';
import { PersonService } from 'src/app/person/person.service';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation.modal/confirmation.modal.component';
import { SessionService } from '../session.service';

@Component({
  selector: 'mm-session-home',
  templateUrl: './session-home.component.html',
  styleUrls: ['./session-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionHomeComponent implements OnInit {
  private onDestroy$ = new Subject();
  public editDrinkClicked$ = new Subject();
  private editDrinkClickedUrl$ = this.editDrinkClicked$;
  public addGuardianClicked$ = new Subject();
  addGuardianClickedUrl$ = this.addGuardianClicked$.pipe(mapTo('createGuardian'))
  public addChildClicked$ = new Subject();
  addChildClickedUrl$ = this.addChildClicked$.pipe(mapTo('createChild'))

  public hasBowlNoSubject$ = new Subject<string>();
  public hasBowlYesSubject$ = new Subject<string>();

  private readonly sessionId = this.route.snapshot.paramMap.get('sessionId') as string;
  private readonly termId = this.route.snapshot.paramMap.get('termId') as string;
  public readonly personType = personType;

  public searchChanged$ = new Subject<string>();
  public searchChangedWithDebounce$ = this.searchChanged$.pipe(
    debounceTime(150)
  )

  private currentSessionBirthdaysMap$ = this.sessionService.currentSessionBirthdaysMap$.pipe(
    filter(({ sessionId }) => sessionId === this.sessionId),
    map(({ birthdaysMap }) => birthdaysMap),
    take(1)
  )

  private currentSessionAttendanceMap$ = this.sessionService.attendanceMap$.pipe(
    map((attendanceMap) => Object.entries(attendanceMap)
      .reduce((acc, [key, value]) =>  ({ ...acc, [key]: value.filter(v => v !== this.sessionId )}), {} as { [key: string]: string[] })
    ),
    take(1)  
  )

  private currentSessionFamilies$: Observable<{ [key: string]: PersonForDisplay[] }> = 
    combineLatest([
      this.sessionService.currentSession$,
      this.currentSessionBirthdaysMap$, 
      this.currentSessionAttendanceMap$,
      this.personService.families$
    ]).pipe(
      map(([currentSession, birthdaysMap, attendanceMap, familyMap]) => Object.entries(familyMap).reduce((acc, [key, persons]) => ({
        ...acc,
        [key]: 
        persons.map(person => ({ 
          ...person, 
          drink: (person as Guardian).drink ? getDisplayNameForDrink((person as Guardian).drink) : null,
          isCertificateSession: attendanceMap[person._id]?.length === 6,
          hasBirthdayInSession: birthdaysMap[person._id],
          isCheckedIn: currentSession?.personIds ? currentSession.personIds.includes(person._id) : false,
          icon: person.type === personType.child ? ['fas', 'baby'] as [IconPrefix, IconName]: ['fas', 'user'] as [IconPrefix, IconName]
        })
      )}), {})),
  );

  public filteredFamilies$ = combineLatest([this.currentSessionFamilies$, this.searchChangedWithDebounce$.pipe(startWith(""))]).pipe(
    map(([familyMap, filterString]) => {
      const filterStrings = filterString.split(' ');
      return Object.values(familyMap)
        .filter(persons => persons.some(person => this.personMatchesFilterString(filterStrings, person)))
        .map(persons => persons.sort((a, b) => {
          const aMatches = this.personMatchesFilterString(filterStrings, a);
          const bMatches = this.personMatchesFilterString(filterStrings, b);
          return aMatches && bMatches ? 0
            : aMatches && !bMatches ? -1 : 
            1
        }));
    }),
    share()
  );

  private personMatchesFilterString(filterStrings: string[], { firstName, lastName }: PersonForDisplay) {
    return filterStrings
      .every(fs => (firstName.trim() + lastName.trim()).toLocaleLowerCase().includes(fs.toLocaleLowerCase().trim()))
  }

  public checkInClicked$ = new Subject<PersonForDisplay>();
  private hasFamilyMemberCheckedIn$ = this.checkInClicked$.pipe(
    withLatestFrom(this.currentSessionFamilies$),
    map(([person, familyMap]) => ({ person, checkInRequired: !familyMap[person.familyId].some(p => p.isCheckedIn) })),
    share()
  );

  private checkInAndCovidConfirmed$ = this.hasFamilyMemberCheckedIn$.pipe(
    filter(({ checkInRequired }) => checkInRequired),
    exhaustMap(({ person }) => {
      const dialogRef = this.dialog.open(ConfirmationModalComponent, {
        width: "500px",
        data: {
          title: "In coming today, I confirm:",
          paragraphs: [
            "We have not, in the past fourteen days, been in contact with anyone who has been overseas or diagnosed with coronavirus.",
            "We have not personally been diagnosed with coronavirus and do not have any common cold or flu-like symptoms.",
            "We have not been in contact with anyone who has common cold or flu-like symptoms.",
            "We are healthy and, to the best of my knowledge, pose no known risk to myself or others in this session."
          ]
        }
      });
      return dialogRef.afterClosed().pipe(map((wasConfirmed: boolean) => ({ person, wasConfirmed })));
    }),
    filter(({ wasConfirmed }) => wasConfirmed)
  );

  private checkInAndNoCovidRequired$ = this.hasFamilyMemberCheckedIn$.pipe(
    filter(({ checkInRequired }) => !checkInRequired)
  );

  private checkIn$ = merge(
    this.checkInAndNoCovidRequired$,
    this.checkInAndCovidConfirmed$
  ).pipe(
    mergeMap(({ person }) => this.sessionService.checkIn(this.termId, this.sessionId, person._id).pipe(
      catchAndContinue(),
      map(_ => person)
    )),
    share()
  )

  private childCheckedIn$ = this.checkIn$.pipe(
    filter(({ type }) => type === personType.child)
  );

  private showHasBirthdayToast$ = this.childCheckedIn$.pipe(
    filter(({ hasBirthdayInSession, isCertificateSession }) => hasBirthdayInSession && !isCertificateSession),
    tap(_ => this.snackBar.open('Happy Birthday!', undefined, { duration: 3000 }))
  );

  private showHasCertificateToast$ = this.childCheckedIn$.pipe(
    filter(({ hasBirthdayInSession, isCertificateSession }) => !hasBirthdayInSession && isCertificateSession),
    tap(_ => this.snackBar.open('Congratulations on your certificate!', undefined, { duration: 3000 }))
  );

  private showHasBirthdayAndHasCertificateToast$ = this.childCheckedIn$.pipe(
    filter(({ hasBirthdayInSession, isCertificateSession }) => hasBirthdayInSession && isCertificateSession),
    tap(_ => this.snackBar.open('Happy Birthday and congratulations on your certificate!', undefined, { duration: 3000 }))
  );

  public checkOutClicked$ = new Subject<string>();
  private checkOut$ = this.checkOutClicked$.pipe(
    mergeMap(personId => this.sessionService.checkOut(this.termId, this.sessionId, personId).pipe(
      catchAndContinue()
    ))
  )

  private updateHasBowl$ = merge(
    this.hasBowlNoSubject$.pipe(map(id => ({ id, hasBowl: false }))),
    this.hasBowlYesSubject$.pipe(map(id => ({ id, hasBowl: true })))
  ).pipe(
    mergeMap(({ id, hasBowl }) => this.personService.updateHasBowl(id, hasBowl).pipe(
      catchAndContinue()
    ))
  )

  private navigate$ = merge(
    this.editDrinkClickedUrl$,
    this.addGuardianClickedUrl$,
    this.addChildClickedUrl$
  ).pipe(
    tap(url => this.router.navigate([url], { relativeTo: this.route }))
  );

  constructor(
    private sessionService: SessionService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    merge(
      this.checkIn$,
      this.checkOut$,
      this.updateHasBowl$,
      this.navigate$,
      this.showHasBirthdayAndHasCertificateToast$,
      this.showHasBirthdayToast$,
      this.showHasCertificateToast$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
