import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionToolbarService {
  private showSidebarSubject = new BehaviorSubject(true);
  public showSidebar$ = this.showSidebarSubject.asObservable();

  constructor() { }

  public hide(): void {
    this.showSidebarSubject.next(false);

  }

  public show(): void {
    this.showSidebarSubject.next(true);
  }
}
