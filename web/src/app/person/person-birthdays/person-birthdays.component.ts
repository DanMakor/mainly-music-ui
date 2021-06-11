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
    map(children => children.sort((a, b) => {
      const zeroedAYear = a.dateOfBirth || new Date(a.dateOfBirth);
      if (zeroedAYear) {
        zeroedAYear.setFullYear(0);
      }
      const zeroedBYear = b.dateOfBirth || new Date(b.dateOfBirth);
      if (zeroedBYear) {
        zeroedBYear.setFullYear(0);
      }
      return nullableDateCompare(zeroedBYear, zeroedAYear)
    }))
  );

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
