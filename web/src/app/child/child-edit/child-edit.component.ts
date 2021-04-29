import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, merge } from 'rxjs';
import { map, tap, filter, withLatestFrom, exhaustMap, takeUntil } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { Child } from '../child';

@Component({
  selector: 'mm-child-edit',
  templateUrl: './child-edit.component.html',
  styleUrls: ['./child-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildEditComponent implements OnInit {
  private onDestroy$ = new Subject();

  private readonly personId = this.route.snapshot.paramMap.get('personId') as string;

  private child$ = this.personService.children$.pipe(
    map(children => {
      const child = children.find(c => c._id === this.personId) as Child
      return { ...child, dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth) : null }
    }),
  );

  private setChild$ = this.child$.pipe(
    tap(child => this.child.setValue(child))
  );

  public child = new FormControl("", Validators.required);
  public saveClicked$ = new Subject();

  private saveChild$ = this.saveClicked$.pipe(
    filter(_ => this.child.valid),
    withLatestFrom(this.child$),
    exhaustMap(([_, lastGuardian]) => this.personService.updatePerson(this.personId, { ...lastGuardian, ...this.child.value }).pipe(
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
      this.setChild$,
      this.saveChild$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
