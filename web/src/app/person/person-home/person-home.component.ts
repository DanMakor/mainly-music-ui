import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { merge, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Guardian } from 'src/app/guardian/guardian';
import { Staff } from 'src/app/staff/staff';
import { Child } from '../../child/child';
import { personType } from '../person-type';
import { PersonService } from '../person.service';

@Component({
  selector: 'mm-person-home',
  templateUrl: './person-home.component.html',
  styleUrls: ['./person-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonHomeComponent implements OnInit {
  private onDestroy$ = new Subject();

  public createFamilyClicked$ = new Subject();
  public editPersonClicked$ = new Subject<Child | Guardian | Staff>();

  public persons$ = this.personService.persons$.pipe(
    map(persons => persons.map(p => ({ 
      ...p, 
      icon: p.type === personType.child ? 'baby' as IconName : p.type === personType.guardian ? 'user' as IconName : 'user-secret' as IconName
    })))
  );

  private goToCreateFamily$ = this.createFamilyClicked$.pipe(
    tap(_ => this.router.navigate(['createFamily'], { relativeTo: this.route}))
  );

  private goToEditPerson$ = this.editPersonClicked$.pipe(
    tap(person => this.router.navigate(['/' + personType[person.type] + 's', person._id]))
  );

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    merge(
      this.goToCreateFamily$,
      this.goToEditPerson$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
