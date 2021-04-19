import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { map, mapTo, scan, share, shareReplay, startWith, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private onDestroy$ = new Subject();

  private setLoading$ = new Subject();
  private setCompleted$ = new Subject();

  public isLoading$ = merge(
    this.setLoading$.pipe(mapTo(1)),
    this.setCompleted$.pipe(mapTo(-1))
  ).pipe(
    startWith(0),
    scan((acc, curr) => acc + curr, 0),
    map(count => count !== 0),
    shareReplay(1)
  )

  setLoading(): void {
    this.setLoading$.next();
  }

  setCompleted(): void {
    this.setCompleted$.next();
  }

  constructor() {
    this.isLoading$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
