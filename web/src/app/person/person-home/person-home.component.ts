import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-person-home',
  templateUrl: './person-home.component.html',
  styleUrls: ['./person-home.component.scss']
})
export class PersonHomeComponent implements OnInit {
  private onDestroy$ = new Subject();

  public createFamilyClicked$ = new Subject();

  private goToCreateFamily$ = this.createFamilyClicked$.pipe(
    tap(_ => this.router.navigate(['createFamily'], { relativeTo: this.route}))
  )
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.goToCreateFamily$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
