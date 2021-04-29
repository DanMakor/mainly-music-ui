import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { exhaustMap, filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';

@Component({
  selector: 'mm-guardian-edit',
  templateUrl: './guardian-edit.component.html',
  styleUrls: ['./guardian-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuardianEditComponent implements OnInit {
  private onDestroy$ = new Subject();

  private readonly personId = this.route.snapshot.paramMap.get('personId') as string;

  private guardian$ = this.personService.guardians$.pipe(
    map(guardians => guardians.find(g => g._id === this.personId)),
  );

  private setGuardian$ = this.guardian$.pipe(
    tap(guardian => this.guardian.setValue(guardian))
  );

  public guardian = new FormControl("", Validators.required);
  public saveClicked$ = new Subject();

  public persons$ = this.personService.attendees$;

  private saveGuardian$ = this.saveClicked$.pipe(
    filter(_ => this.guardian.valid),
    withLatestFrom(this.guardian$),
    exhaustMap(([_, lastGuardian]) => this.personService.updatePerson(this.personId, { ...lastGuardian, ...this.guardian.value }).pipe(
      tap(_ => this.router.navigate(['../'], { relativeTo: this.route })),
      catchAndContinue()
    ))
  );

  constructor(
    private personService: PersonService, 
    private router: Router, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    merge(
      this.setGuardian$,
      this.saveGuardian$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
