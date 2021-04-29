import { NgModule } from '@angular/core';
import { StaffCreateComponent } from './staff-create/staff-create.component';
import { DrinkModule } from '../drink/drink.module';
import { SharedModule } from '../shared/shared.module';
import { StaffEditComponent } from './staff-edit/staff-edit.component';
import { StaffInputComponent } from './staff-input/staff-input.component';

@NgModule({
  declarations: [StaffCreateComponent, StaffEditComponent, StaffInputComponent],
  imports: [
    SharedModule,
    DrinkModule
  ],
  exports: [StaffCreateComponent, StaffEditComponent]
})
export class StaffModule { }
