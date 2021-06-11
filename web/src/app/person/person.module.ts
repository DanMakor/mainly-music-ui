import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildCreateComponent } from '../child/child-create/child-create.component';
import { ChildModule } from '../child/child.module';
import { GuardianCreateComponent } from '../guardian/guardian-create/guardian-create.component';
import { GuardianModule } from '../guardian/guardian.module';
import { SharedModule } from '../shared/shared.module';
import { FamilyCreateComponent } from './family-create/family-create.component';
import { PersonHomeComponent } from './person-home/person-home.component';
import { StaffCreateComponent } from '../staff/staff-create/staff-create.component';
import { StaffModule } from '../staff/staff.module';
import { GuardianEditComponent } from '../guardian/guardian-edit/guardian-edit.component';
import { StaffEditComponent } from '../staff/staff-edit/staff-edit.component';
import { ChildEditComponent } from '../child/child-edit/child-edit.component';
import { PersonBirthdaysComponent } from './person-birthdays/person-birthdays.component';

const routes: Routes = [
  { path: 'persons', component: PersonHomeComponent },
  { path: 'persons/birthdays', component: PersonBirthdaysComponent },
  { path: 'persons/createFamily', component: FamilyCreateComponent },
  { path: 'persons/createGuardian', component: GuardianCreateComponent },
  { path: 'persons/createChild', component: ChildCreateComponent },
  { path: 'persons/createStaffMember', component: StaffCreateComponent },
  { path: 'guardians', pathMatch: 'full', redirectTo: 'persons' },
  { path: 'guardians/:personId', component: GuardianEditComponent },
  { path: 'staffs', pathMatch: 'full', redirectTo: 'persons' },
  { path: 'staffs/:personId', component: StaffEditComponent },
  { path: 'childs', pathMatch: 'full', redirectTo: 'persons' },
  { path: 'childs/:personId', component: ChildEditComponent },
];

@NgModule({
  declarations: [PersonHomeComponent, FamilyCreateComponent, PersonBirthdaysComponent],
  imports: [
    SharedModule,
    ChildModule,
    GuardianModule,
    StaffModule,
    RouterModule.forChild(routes)
  ]
})
export class PersonModule { }
