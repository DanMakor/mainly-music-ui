import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonService } from 'src/app/person/person.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'mm-session-report',
  templateUrl: './session-reports.component.html',
  styleUrls: ['./session-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionReportsComponent implements OnInit {
  ngOnInit(): void {
    
  }
}
