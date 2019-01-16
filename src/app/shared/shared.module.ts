import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconModule } from './fa-icon/fa-icon.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AmountValidatorDirective } from './directives/amount-validator.directive'
@NgModule({
  declarations: [AmountValidatorDirective, SpinnerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    FaIconModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    FaIconModule,
    SpinnerComponent,
    AmountValidatorDirective
  ]
})
export class SharedModule { }
