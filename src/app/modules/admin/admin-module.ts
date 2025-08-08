import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Homepage } from './homepage/homepage';
import { Navbar } from "../../common/components/navbar/navbar";


@NgModule({
  declarations: [
    Homepage
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    Navbar
]
})
export class AdminModule { }
