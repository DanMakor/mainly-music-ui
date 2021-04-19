import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { exhaustMap, filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { SessionService } from '../session.service';
import { TermService } from '../term.service';

@Component({
  selector: 'app-term-details',
  templateUrl: './term-details.component.html',
  styleUrls: ['./term-details.component.scss']
})
export class TermDetailsComponent implements OnInit {
  private onDestroy$ = new Subject();
  public startSessionClicked$ = new Subject();
  private termId = this.route.snapshot.paramMap.get('termId');

  private startSession$ = this.startSessionClicked$.pipe(
    exhaustMap(_ => this.sessionService.create(this.termId as string).pipe(
      catchAndContinue()
    )),
    filter(({ isError }) => !isError),
    tap(({ value }) => this.router.navigate([`./sessions/${value?._id}`], { relativeTo: this.route }))
  )

  public currentTermFamilies$ = this.termService.currentTermFamilies$.pipe(
    map(termFamilies => termFamilies?.map(termFamily => ({ 
        ...termFamily, 
        familyName: termFamily.persons?.reduce((acc, curr) => (acc ? acc + ", " : acc) + curr.firstName + " " + curr.lastName, "") 
      }))
    )
  );

  public currentTermSessions$ = combineLatest([this.termService.currentTerm$, this.sessionService.sessionsMap$]).pipe(
    map(([currentTerm, sessions]) => Object.values(sessions)
      .filter(s => s.termId === currentTerm?._id)
      .map(ses => ({ _id: ses._id, count: ses.personIds?.length, date: ses.date }))
    )
  );

  constructor(
    private termService: TermService, 
    private sessionService: SessionService, 
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.startSession$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
