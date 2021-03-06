import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, merge, Subject } from 'rxjs';
import { debounceTime, exhaustMap, filter, map, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';

@Component({
  selector: 'mm-child-create',
  templateUrl: './child-create.component.html',
  styleUrls: ['./child-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildCreateComponent implements OnInit {
  private onDestroy$ = new Subject();

  public child = new FormControl("", Validators.required);
  public familyId = new FormControl("", Validators.required);
  public allowPhotographs$ = new Subject();
  public saveClicked$ = new Subject();

  public persons$ = this.personService.attendees$;

  private saveChild$ = this.saveClicked$.pipe(
    filter(_ => this.child.valid && this.familyId.valid),
    tap(_ => this.child.errors),
    withLatestFrom(this.allowPhotographs$),
    exhaustMap(([_, allowPhotographs]) => this.personService.createChild({ ...this.child.value, allowPhotographs }, this.familyId.value).pipe(
      tap(_ => this.router.navigate(['../'], { relativeTo: this.route })),
      catchAndContinue()
    ))
  )

  private markAsTouched$ = this.saveClicked$.pipe(
    filter(_ => !this.child.valid || !this.familyId.valid),
    tap(_ => { 
      this.child.markAsTouched();
      this.familyId.markAsTouched();
    })
  )

  constructor(private personService: PersonService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    merge(
      this.saveChild$,
      this.markAsTouched$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
