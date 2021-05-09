import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, filter, exhaustMap, takeUntil } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';

@Component({
  selector: 'mm-guardian-create',
  templateUrl: './guardian-create.component.html',
  styleUrls: ['./guardian-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuardianCreateComponent implements OnInit {
  private onDestroy$ = new Subject();

  public guardian = this.fb.group({
    firstName: this.fb.control('', Validators.required),
    lastName: this.fb.control('', Validators.required),
    drink: this.fb.control('')
  });
  public familyId = new FormControl("", Validators.required);
  public saveClicked$ = new Subject();

  public persons$ = this.personService.attendees$;

  private saveGuardian$ = this.saveClicked$.pipe(
    filter(_ => this.guardian.valid && this.familyId.valid),
    exhaustMap(_ => this.personService.createGuardian(this.guardian.value, this.familyId.value).pipe(
      tap(_ => this.router.navigate(['../'], { relativeTo: this.route })),
      catchAndContinue()
    ))
  )

  constructor(private personService: PersonService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.saveGuardian$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
