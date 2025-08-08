import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';


import { UserRoutingModule } from './user-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { Navbar } from "../../common/components/navbar/navbar";

import { List } from './shared/list/list';
import { Sample } from './shared/sample/sample';
import { Rate } from './shared/rate/rate';
import { Manager } from './shared/manager/manager';
import { Form } from './shared/form/form';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    Dashboard,
    List,
    Sample,
    Manager,
    Form,
    Rate
  ],
  imports: [
    Navbar,
    CommonModule,
    UserRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    List,
    Sample,
    Manager,
    Form,
    Rate
  ]
})
export class UserModule {

}
