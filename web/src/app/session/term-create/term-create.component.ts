import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { exhaustMap, filter, takeUntil, tap } from 'rxjs/operators';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { TermService } from '../term.service';

@Component({
  selector: 'app-term-create',
  templateUrl: './term-create.component.html',
  styleUrls: ['./term-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermCreateComponent implements OnInit {
  private onDestroy$ = new Subject();
  private readonly currentYear = new Date().getFullYear();

  public term = this.fb.group({
    termNumber: [null, Validators.required],
    year: [this.currentYear, Validators.required]
  })

  public years: number[] = [
    this.currentYear + 1, 
    this.currentYear, 
    this.currentYear - 1
  ];

  public saveClicked$ = new Subject();

  private markAsTouched$ = this.saveClicked$.pipe(
    filter(_ => !this.term.valid),
    tap(_ => this.term.markAllAsTouched())
  );

  private saveAndGoBack$ = this.saveClicked$.pipe(
    filter(_ => this.term.valid),
    exhaustMap(_ => this.termService.create(this.term.value).pipe(
      tap(_ => this.router.navigate(['../'], { relativeTo: this.route })),
      catchAndContinue()
    ))
  )

  constructor(
    private fb: FormBuilder, 
    private termService: TermService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    merge(
      this.markAsTouched$,
      this.saveAndGoBack$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
