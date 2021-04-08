import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrinkInputComponent } from './drink-input/drink-input.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DrinkInputComponent],
  imports: [
    SharedModule
  ],
  exports: [
    DrinkInputComponent
  ]
})
export class DrinkModule { }
