import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Share } from './share/share';
import { Checklist } from './checklist/checklist';
import { Expenses } from './expenses/expenses';
import { Itinerary } from './itinerary/itinerary';
import { Reviews } from './reviews/reviews';
import { Details } from './details/details';
import { Edit } from './edit/edit';

const routes: Routes = [
  { path: 'share/:id', component: Share },
  { path: ':id/checklist', component: Checklist },
  { path: ':id/expenses', component: Expenses },
  { path: ':id/itinerary', component: Itinerary },
  { path: 'reviews', component: Reviews},
  { path: 'edit/:id', component: Edit},
  { path: 'details/:id', component: Details}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripRoutingModule { }
