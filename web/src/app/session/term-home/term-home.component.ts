import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { SessionService } from '../session.service';
import { Term } from '../term';
import { TermService } from '../term.service';

@Component({
  selector: 'app-term-home',
  templateUrl: './term-home.component.html',
  styleUrls: ['./term-home.component.scss']
})
export class TermHomeComponent implements OnInit {
  private onDestroy$ = new Subject();

  public terms$ = this.termService.terms$;

  constructor(private termService: TermService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
