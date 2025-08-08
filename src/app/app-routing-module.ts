import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFound } from './common/components/page-not-found/page-not-found';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'trip',
    loadChildren: () => import('./modules/trips/features/trip/trip-module').then(m => m.TripModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user-module').then(m => m.UserModule)
  },
  {
    path: 'landing-page',
    loadComponent: () => import('./common/components/landing-page/landing-page').then(m => m.Landing)
  },
  {
    path: '',
    loadComponent: () => import('./common/components/landing-page/landing-page').then(m => m.Landing)
  },
  {
    path: '**',
    component: PageNotFound
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
