import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UuidModule } from 'ng2-uuid';
import { SelectComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    UuidModule
  ],
  declarations: [
    SelectComponent
  ],
  exports: [
    SelectComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SelectingModule { }
