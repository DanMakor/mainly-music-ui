import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Child } from '../../child/child';
import { personType } from '../person-type';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-person-home',
  templateUrl: './person-home.component.html',
  styleUrls: ['./person-home.component.scss']
})
export class PersonHomeComponent implements OnInit {
  private onDestroy$ = new Subject();

  public createFamilyClicked$ = new Subject();

  public persons$ = this.personService.persons$.pipe(
    map(persons => persons.map(p => ({ 
      ...p, 
      icon: p.type === personType.child ? 'baby' as IconName : p.type === personType.guardian ? 'user' as IconName : 'user-secret' as IconName
    })))
  );

  private goToCreateFamily$ = this.createFamilyClicked$.pipe(
    tap(_ => this.router.navigate(['createFamily'], { relativeTo: this.route}))
  )
  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    this.goToCreateFamily$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
