import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchStringSubject = new ReplaySubject<string>(1);
  public searchString$ = this.searchStringSubject.pipe(
    debounceTime(150)
  );

  constructor() {  }

  public setSearchString(searchString: string) {
    this.searchStringSubject.next(searchString);
  }
}
