import { NgModule } from '@angular/core';
import { DrinkModule } from '../drink/drink.module';
import { SharedModule } from '../shared/shared.module';
import { GuardianInputComponent } from './guardian-input/guardian-input.component';
import { GuardianCreateComponent } from './guardian-create/guardian-create.component';

@NgModule({
  declarations: [GuardianInputComponent, GuardianCreateComponent],
  imports: [
    SharedModule,
    DrinkModule
  ],
  exports: [GuardianInputComponent, GuardianCreateComponent]
})
export class GuardianModule { }
