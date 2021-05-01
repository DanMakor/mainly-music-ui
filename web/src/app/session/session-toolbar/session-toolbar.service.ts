import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RightSidenavService } from 'src/app/right-sidenav.service';

@Injectable({
  providedIn: 'root'
})
export class SessionToolbarService {
  private showToolbarSubject = new BehaviorSubject(true);
  public showToolbar$ = this.showToolbarSubject.asObservable();

  constructor() { }

  public hide(): void {
    this.showToolbarSubject.next(false);

  }

  public show(): void {
    this.showToolbarSubject.next(true);
  }
}
