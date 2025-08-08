import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Signup } from './features/signup/signup';
import { Profile } from './features/profile/profile';


const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'profile', component: Profile }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
