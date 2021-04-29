import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

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
