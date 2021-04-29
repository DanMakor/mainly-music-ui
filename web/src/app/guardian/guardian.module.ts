import { NgModule } from '@angular/core';
import { DrinkModule } from '../drink/drink.module';
import { SharedModule } from '../shared/shared.module';
import { GuardianInputComponent } from './guardian-input/guardian-input.component';
import { GuardianCreateComponent } from './guardian-create/guardian-create.component';
import { GuardianEditComponent } from './guardian-edit/guardian-edit.component';

@NgModule({
  declarations: [GuardianInputComponent, GuardianCreateComponent, GuardianEditComponent],
  imports: [
    SharedModule,
    DrinkModule
  ],
  exports: [GuardianInputComponent, GuardianCreateComponent, GuardianEditComponent]
})
export class GuardianModule { }
