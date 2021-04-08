import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, merge, combineLatest } from 'rxjs';
import { filter, tap, exhaustMap, takeUntil, map, share } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { Registration } from '../registration';
import { TermService } from '../term.service';

@Component({
  selector: 'mm-term-register',
  templateUrl: './term-register.component.html',
  styleUrls: ['./term-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermRegisterComponent implements OnInit {
  private onDestroy$ = new Subject();
  public registrationId = this.route.snapshot.paramMap.get("registrationId");
  public registration = this.fb.group({
    familyId: [null, Validators.required],
    paid: [false],
    notes: ""
  });

  private setRegistration$ = this.termService.currentTerm$.pipe(
    filter(_ => !!this.registrationId),
    map(term => term?.registrations
      .find(registration => registration.familyId === this.registrationId)
    ),
    filter(registration => !!registration),
    tap(registration => {
      this.registration.setValue(registration as Registration);
      this.registration.get('familyId')?.disable();
    })
  )

  public persons$ = combineLatest([this.personService.persons$, this.termService.currentTerm$]).pipe(
    map(([persons, term]) => this.registrationId ? persons : persons 
      .filter(person => !term?.registrations.some(({ familyId }) => person.familyId === familyId))
    )
  );

  public saveClicked$ = new Subject();
  public backClicked$ = new Subject();

  private markAsTouched$ = this.saveClicked$.pipe(
    filter(_ => !this.registration.valid),
    tap(_ => this.registration.markAllAsTouched())
  );

  private saveClickedAndFormValid$ = this.saveClicked$.pipe(
    filter(_ => this.registration.valid)
  );

  private createRegistration$ = this.saveClickedAndFormValid$.pipe(
    filter(_ => !this.registrationId),
    exhaustMap(_ => this.termService.register(this.registration.value, this.route.snapshot.paramMap.get("termId") as string).pipe(
      catchAndContinue()
    )),
    share()
  );

  private updateRegistration$ = this.saveClickedAndFormValid$.pipe(
    filter(_ => !!this.registrationId),
    exhaustMap(_ => this.termService.updateRegistration(this.registration.getRawValue(), this.route.snapshot.paramMap.get("termId") as string).pipe(
      catchAndContinue()
    )),
    share()
  );

  private goBack$ = merge(
    this.createRegistration$.pipe(filter(({ isError }) => !isError)),
    this.updateRegistration$.pipe(filter(({ isError }) => !isError)),
    this.backClicked$
  ).pipe(
    tap(_ => this.router.navigate(['../../'], { relativeTo: this.route }))
  );

  constructor(
    private fb: FormBuilder, 
    private termService: TermService,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    merge(
      this.markAsTouched$,
      this.goBack$,
      this.setRegistration$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
