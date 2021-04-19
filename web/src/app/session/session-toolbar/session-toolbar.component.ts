import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { TermService } from '../term.service';
import { SessionToolbarService } from './session-toolbar.service';

@Component({
  selector: 'mm-session-toolbar',
  templateUrl: './session-toolbar.component.html',
  styleUrls: ['./session-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionToolbarComponent implements OnInit {

  constructor(private termService: TermService, private sessionService: SessionService, private sessionToolbarService: SessionToolbarService) { }

  public showSidebar$ = this.sessionToolbarService.showSidebar$;

  public currentTerm$ = this.termService.currentTerm$
  public currentSession$ = combineLatest([this.termService.currentTerm$, this.sessionService.currentSession$]).pipe(
    map(([currentTerm, currentSession]) => currentTerm._id === currentSession.termId ? currentSession : null)
  );

  ngOnInit(): void {
  }

}
