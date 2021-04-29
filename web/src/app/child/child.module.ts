import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChildInputComponent } from './child-input/child-input.component';
import { ChildCreateComponent } from './child-create/child-create.component';
import { ChildEditComponent } from './child-edit/child-edit.component';

@NgModule({
  declarations: [ChildInputComponent, ChildCreateComponent, ChildEditComponent],
  imports: [
    SharedModule
  ],
  exports: [ChildInputComponent, ChildCreateComponent, ChildEditComponent]
})
export class ChildModule { }
