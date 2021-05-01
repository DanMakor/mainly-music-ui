import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class LeftSidenavService {
  private sidenav: MatSidenav | undefined;

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public open() {
    return this.sidenav && this.sidenav.open();
  }

  public close() {
    return this.sidenav && this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav && this.sidenav.toggle();
  }
}
