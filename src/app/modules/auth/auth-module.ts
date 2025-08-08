import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './features/login/login';
import { Signup } from './features/signup/signup';
import { Profile } from './features/profile/profile';



@NgModule({
  declarations: [
    Login,
    Signup,
    Profile,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [ 
    Login,
    Signup,
    Profile
  ]
})
export class AuthModule { }
