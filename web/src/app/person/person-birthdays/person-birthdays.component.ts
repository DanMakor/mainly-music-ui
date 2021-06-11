import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { nullableDateCompare } from '../../helpers';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-person-birthdays',
  templateUrl: './person-birthdays.component.html',
  styleUrls: ['./person-birthdays.component.scss']
})
export class PersonBirthdaysComponent implements OnInit {
  public onDestroy$ = new Subject();

  constructor(private personService: PersonService) { }

  public children$ = this.personService.children$.pipe(
    map(children => children.sort((a, b) => nullableDateCompare(a.dateOfBirth, b.dateOfBirth)))
  );

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
