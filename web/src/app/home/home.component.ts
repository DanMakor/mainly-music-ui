import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { exhaustMap, filter, tap, takeUntil } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { catchAndContinue } from '../shared/catch-and-continue';

@Component({
  selector: 'mm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor() {}

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }
}
