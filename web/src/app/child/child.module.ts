import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChildInputComponent } from './child-input/child-input.component';
import { ChildCreateComponent } from './child-create/child-create.component';

@NgModule({
  declarations: [ChildInputComponent, ChildCreateComponent],
  imports: [
    SharedModule
  ],
  exports: [ChildInputComponent, ChildCreateComponent]
})
export class ChildModule { }
