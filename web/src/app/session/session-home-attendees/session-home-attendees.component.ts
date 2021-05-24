import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, merge, ReplaySubject, Subject } from 'rxjs';
import { map, share, startWith, take, takeUntil, tap } from 'rxjs/operators';
import { PersonForDisplay } from 'src/app/person/person-for-display';
import { personType } from 'src/app/person/person-type';
import { SearchService } from '../search.service';

@Component({
  selector: 'mm-session-home-attendees',
  templateUrl: './session-home-attendees.component.html',
  styleUrls: ['./session-home-attendees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionHomeAttendeesComponent implements OnInit {
  private onDestroy$ = new Subject();
  public personType = personType;
  
  @Output() public checkedIn = new EventEmitter<PersonForDisplay>();
  @Output() public checkedOut = new EventEmitter<string>();
  @Output() public hasBowlChanged = new EventEmitter<{ id: string, hasBowl: boolean }>();

  @Input() public set families(map: { [key: string]: PersonForDisplay[] } | null) {
    map && this.familiesMap$.next(map);
  }
  private familiesMap$ = new ReplaySubject<{ [key: string]: PersonForDisplay[] }>(1);

  public checkInFamilyClicked$ = new Subject();
  
  private updateSearchInput$ = this.checkInFamilyClicked$.pipe(
    tap(_ => this.input.setValue(""))
  );

  public input = new FormControl();
  private setSearchString$ =  merge(
    this.input.valueChanges
  ).pipe(
    tap(searchString => this.searchService.setSearchString(searchString))
  );

  private setSearchInput$ = merge(
    this.searchService.searchString$
 ).pipe(
    take(1),
    tap(searchString => this.input.setValue(searchString, { emitEvent: false }))
  );

  public filteredFamilies$ = combineLatest([this.familiesMap$, this.searchService.searchString$.pipe(startWith(""))]).pipe(
    map(([familyMap, filterString]) => {
      const filterStrings = filterString.split(' ');
      return Object.values(familyMap)
        .filter(persons => persons.some(person => this.personMatchesFilterString(filterStrings, person)))
        .map(persons => persons.sort((a, b) => {
          const aMatches = this.personMatchesFilterString(filterStrings, a);
          const bMatches = this.personMatchesFilterString(filterStrings, b);
          return aMatches && bMatches ? 0
            : aMatches && !bMatches ? -1 : 
            1
        }));
    }),
    share()
  );

  private personMatchesFilterString(filterStrings: string[], { firstName, lastName }: PersonForDisplay) {
    return filterStrings
      .every(fs => (firstName.trim() + lastName.trim()).toLocaleLowerCase().includes(fs.toLocaleLowerCase().trim()))
  }
  
  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    merge(
      this.setSearchString$,
      this.updateSearchInput$,
      this.setSearchInput$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
