import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionHomeComponent } from './session-home/session-home.component';
import { SharedModule } from '../shared/shared.module';
import { DrinkEditComponent } from './drink-edit/drink-edit.component';
import { DrinkModule } from '../drink/drink.module';
import { ChildCreateComponent } from '../child/child-create/child-create.component';
import { GuardianCreateComponent } from '../guardian/guardian-create/guardian-create.component';
import { GuardianModule } from '../guardian/guardian.module';
import { ChildModule } from '../child/child.module';
import { TermHomeComponent } from './term-home/term-home.component';
import { TermCreateComponent } from './term-create/term-create.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { TermRegisterComponent } from './term-register/term-register.component';
import { TermGuard } from './term.guard';
import { SessionGuard } from './session.guard';
import { SessionBirthdaysAndCertificatesComponent } from './session-birthdays-and-certificates/session-birthdays-and-certificates.component';
import { SessionDrinksComponent } from './session-drinks/session-drinks.component';
import { SessionBowlsComponent } from './session-bowls/session-bowls.component';
import { SessionReportsComponent } from './session-reports/session-reports.component';
import { SessionPersonDrinksComponent } from './session-person-drinks/session-person-drinks.component';
import { SessionToolbarComponent } from './session-toolbar/session-toolbar.component';

const routes: Routes = [
  { path: "terms", component: TermHomeComponent },
  { path: "terms/create", component: TermCreateComponent },
  { 
    path: "terms/:termId", 
    canActivate: [TermGuard],
    children: [
      { path: "", component: TermDetailsComponent },
      { path: "registrations/create", component: TermRegisterComponent },
      { path: "registrations/:registrationId", component: TermRegisterComponent },
      { path: "sessions/:sessionId", 
        canActivate: [SessionGuard],
        children: [
          { path: "", component: SessionHomeComponent },
          { path: 'createChild', component: ChildCreateComponent },
          { path: 'createGuardian', component: GuardianCreateComponent },
          { 
            path: 'reports', 
            children: [
              { path: '', component: SessionReportsComponent },
              { path: 'birthdays', component: SessionBirthdaysAndCertificatesComponent },
              { path: 'bowls', component: SessionBowlsComponent },
              { path: 'drinks', component: SessionDrinksComponent },
              { path: 'personDrinks', component: SessionPersonDrinksComponent },
            ]
          },
          { path: ':personId', component: DrinkEditComponent }
        ] 
      }
    ]
  }
];


@NgModule({
  declarations: [
    SessionHomeComponent, 
    DrinkEditComponent, 
    TermHomeComponent, 
    TermCreateComponent, 
    TermDetailsComponent, 
    TermRegisterComponent, 
    SessionReportsComponent, 
    SessionBirthdaysAndCertificatesComponent, 
    SessionDrinksComponent, 
    SessionBowlsComponent, 
    SessionPersonDrinksComponent, 
    SessionToolbarComponent
  ],
  imports: [
    SharedModule,
    DrinkModule,
    GuardianModule,
    ChildModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    SessionToolbarComponent
  ]
})
export class SessionModule { }
