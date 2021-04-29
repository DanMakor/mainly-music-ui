import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, merge } from 'rxjs';
import { map, tap, filter, withLatestFrom, exhaustMap, takeUntil } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';

@Component({
  selector: 'mm-staff-edit',
  templateUrl: './staff-edit.component.html',
  styleUrls: ['./staff-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffEditComponent implements OnInit {
  private onDestroy$ = new Subject();

  private readonly personId = this.route.snapshot.paramMap.get('personId') as string;

  private staffMember$ = this.personService.staffMembers$.pipe(
    map(staffMembers => staffMembers.find(g => g._id === this.personId)),
  );

  private setStaffMember$ = this.staffMember$.pipe(
    tap(staffMember => this.staffMember.setValue(staffMember))
  );

  public staffMember = new FormControl("", Validators.required);
  public saveClicked$ = new Subject();

  public persons$ = this.personService.attendees$;

  private saveStaffMember$ = this.saveClicked$.pipe(
    filter(_ => this.staffMember.valid),
    withLatestFrom(this.staffMember$),
    exhaustMap(([_, lastStaffMember]) => this.personService.updatePerson(this.personId, { ...lastStaffMember, ...this.staffMember.value }).pipe(
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
      this.setStaffMember$,
      this.saveStaffMember$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
