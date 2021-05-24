import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Child } from 'src/app/child/child';
import { catchAndContinue } from 'src/app/shared/catch-and-continue';
import { PersonService } from '../person.service';

@Component({
  selector: 'mm-family-create',
  templateUrl: './family-create.component.html',
  styleUrls: ['./family-create.component.scss']
})
export class FamilyCreateComponent implements OnInit {
  private onDestroy$ = new Subject();

  public childrenForm = new FormGroup({
    children: new FormArray([
      new FormControl()
    ])
  });
  
  get children() {
    return this.childrenForm.get('children') as FormArray;
  } 

  public guardian = new FormControl();
  public allowPhotographs = new FormControl(null, Validators.required);

  public saveClicked$ = new Subject();
  public addChildClicked$ = new Subject();
  public removeChildClicked$ = new Subject<number>();

  private addChild$ = this.addChildClicked$.pipe(
    tap(_ => this.children.push(new FormControl()))
  );

  private removeChild$ = this.removeChildClicked$.pipe(
    tap(i => this.children.removeAt(i))
  );

  constructor(private personService: PersonService, private router: Router, private route: ActivatedRoute) {}

  private createFamily$ = this.saveClicked$.pipe(
    switchMap(_ => this.personService.createFamily({ 
      guardians: [this.guardian.value], 
      children: this.children.value.map((child: Child) => ({ ...child, allowPhotographs: this.allowPhotographs.value }))
    }).pipe(
      tap(_ => this.router.navigate(['../'], { relativeTo: this.route })),
      catchAndContinue()
    ))
  )

  ngOnInit(): void {
    merge(
      this.addChild$,
      this.createFamily$,
      this.removeChild$
    ).pipe(takeUntil(this.onDestroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
