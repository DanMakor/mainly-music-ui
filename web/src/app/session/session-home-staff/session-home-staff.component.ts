import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PersonForDisplay, StaffMemberForDisplay } from 'src/app/person/person-for-display';

@Component({
  selector: 'mm-session-home-staff',
  templateUrl: './session-home-staff.component.html',
  styleUrls: ['./session-home-staff.component.scss']
})
export class SessionHomeStaffComponent implements OnInit {
  @Output() public checkedIn = new EventEmitter<PersonForDisplay>();
  @Output() public checkedOut = new EventEmitter<string>();

  @Input() public staffMembers: StaffMemberForDisplay[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }
}
