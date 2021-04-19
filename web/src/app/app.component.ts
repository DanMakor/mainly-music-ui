import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { tap } from 'rxjs/operators';
import { LoadingService } from './core/loading.service';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSidenav, { static: true }) sidenav!: MatSidenav;

  public showProgressBar$ = this.loadingService.isLoading$;

  constructor(private sidenavService: SidenavService, private loadingService: LoadingService) {}

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav)
  }
}
