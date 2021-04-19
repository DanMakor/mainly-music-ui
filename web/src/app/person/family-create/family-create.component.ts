import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { PersonService } from '../person.service';

@Component({
  selector: 'mm-family-create',
  templateUrl: './family-create.component.html',
  styleUrls: ['./family-create.component.scss']
})
export class FamilyCreateComponent implements OnInit {
  private onDestroy$ = new Subject();
  public child = new FormControl();
  public guardian = new FormControl();
  public allowPhotographs = new FormControl(null, Validators.required);

  public saveClicked$ = new Subject();

  constructor(private personService: PersonService, private router: Router, private route: ActivatedRoute) {}

  private createFamily$ = this.saveClicked$.pipe(
    switchMap(_ => this.personService.createFamily({ 
      guardians: [this.guardian.value], 
      children: [{ ...this.child.value, allowPhotographs: this.allowPhotographs.value }]
    }).pipe(
      catchAndContinue()
    )),
    filter(({ isError }) => !isError),
    tap(_ => this.router.navigate(['../', { relativeTo: this.route }]))
  )

  ngOnInit(): void {
    this.createFamily$.pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
