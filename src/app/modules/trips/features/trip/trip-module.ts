import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TripRoutingModule } from './trip-routing-module';
import { Reviews } from './reviews/reviews';
import { Edit } from './edit/edit';
import { Details } from './details/details';
import { Expenses } from './expenses/expenses';
import { Itinerary } from './itinerary/itinerary';
import { Share } from './share/share';
import { Checklist } from './checklist/checklist';


@NgModule({
  declarations: [
    Reviews,
    Edit,
    Details,
    Expenses,
    Itinerary,
    Share,
    Checklist
  ],
  imports: [
    CommonModule,
    TripRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TripModule { }
