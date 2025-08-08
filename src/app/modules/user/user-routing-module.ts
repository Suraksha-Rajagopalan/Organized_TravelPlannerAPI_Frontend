import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Sample } from './shared/sample/sample';
import { List } from './shared/list/list';
import { Rate } from './shared/rate/rate';
import { Form } from './shared/form/form';

const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'list', component: List },
  { path: 'sample', component: Sample},
  { path: 'rate', component: Rate },
  { path: 'form', component: Form}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
