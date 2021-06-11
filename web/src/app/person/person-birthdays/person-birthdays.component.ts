import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
    map(children => [
      ...children.filter(c => c.dateOfBirth).sort((a, b) => b.dateOfBirth.getTime() - a.dateOfBirth.getTime()),
      ...children.filter(c => !c.dateOfBirth)
    ])
  );

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
