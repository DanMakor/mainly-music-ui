import { NgModule } from '@angular/core';
import { StaffCreateComponent } from './staff-create/staff-create.component';
import { DrinkModule } from '../drink/drink.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [StaffCreateComponent],
  imports: [
    SharedModule,
    DrinkModule
  ],
  exports: [StaffCreateComponent]
})
export class StaffModule { }
