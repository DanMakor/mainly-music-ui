import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, exhaustMap, tap, takeUntil } from 'rxjs/operators';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { PersonService } from '../../person/person.service';

@Component({
  selector: 'mm-staff-create',
  templateUrl: './staff-create.component.html',
  styleUrls: ['./staff-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffCreateComponent implements OnInit {
  private onDestroy$ = new Subject();

  public staffMember = new FormControl(null, Validators.required);
  public saveClicked$ = new Subject();

  public persons$ = this.personService.attendees$;

  private saveGuardian$ = this.saveClicked$.pipe(
    filter(_ => this.staffMember.valid),
    exhaustMap(_ => this.personService.createStaffMember(this.staffMember.value).pipe(
      catchAndContinue()
    )),
    filter(({ isError }) => !isError),
    tap(_ => this.router.navigate(['../'], { relativeTo: this.route }))
  )

  constructor(private personService: PersonService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.saveGuardian$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
