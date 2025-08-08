import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../../../../common/services/trip.service';
import { Router } from '@angular/router';
import { TripDto } from '../../../../common/DTOs/Trip/TripDto';

@Component({
  selector: 'app-sample-trips',
  standalone: false,
  templateUrl: './sample.html',
  styleUrls: ['./sample.css']
})
export class Sample {
  sampleTrips: TripDto[] = [
    {
      id: 101,
      title: 'Beach Getaway',
      destination: 'Goa, India',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/beach.jpg',
      description: 'Relax on sunny beaches and enjoy seafood.',
      duration: '7 Days',
      bestTime: 'October to March',
      essentials: ['Sunscreen', 'Swimwear', 'Sunglasses', 'Flip-flops'],
      touristSpots: ['Baga Beach', 'Fort Aguada', 'Dudhsagar Falls'],
      budgetDetails: {
        food: 3000,
        hotel: 6000
      }
    },
    {
      id: 102,
      title: 'Mountain Adventure',
      destination: 'Manali, India',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/mountain.jpg',
      description: 'Explore snow-covered mountains and trekking routes.',
      duration: '5 Days',
      bestTime: 'December to February',
      essentials: ['Warm Clothes', 'Trekking Shoes', 'Backpack'],
      touristSpots: ['Rohtang Pass', 'Solang Valley', 'Hadimba Temple'],
      budgetDetails: {
        food: 2500,
        hotel: 4500
      }
    },
    {
      id: 103,
      title: 'Cultural Expedition',
      destination: 'Jaipur, India',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/culture.jpg',
      description: 'Dive into Rajasthani culture, food, and architecture.',
      duration: '4 Days',
      bestTime: 'November to February',
      essentials: ['Camera', 'Ethnic Wear', 'Sunscreen'],
      touristSpots: ['Amber Fort', 'City Palace', 'Hawa Mahal'],
      budgetDetails: {
        food: 2000,
        hotel: 3500
      }
    },
    {
      id: 104,
      title: 'Backwater Escape',
      destination: 'Alleppey, Kerala',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/backwater.jpg',
      description: 'Stay in a houseboat and explore Kerala’s backwaters.',
      duration: '3 Days',
      bestTime: 'September to March',
      essentials: ['Mosquito Repellent', 'Camera', 'Cotton Clothes'],
      touristSpots: ['Vembanad Lake', 'Alleppey Beach', 'Krishnapuram Palace'],
      budgetDetails: {
        food: 2200,
        hotel: 4000
      }
    },
    {
      id: 105,
      title: 'Desert Safari',
      destination: 'Jaisalmer, Rajasthan',
      startDate: '',
      endDate: '',
      budget: 0,
      travelMode: '',
      notes: '',
      userId: 0,
      image: 'trips/desert.jpg',
      description: 'Enjoy camel rides, folk music, and camping in the desert.',
      duration: '2 Days',
      bestTime: 'October to March',
      essentials: ['Hat', 'Scarf', 'Water Bottle'],
      touristSpots: ['Sam Sand Dunes', 'Jaisalmer Fort', 'Patwon Ki Haveli'],
      budgetDetails: {
        food: 1800,
        hotel: 3000
      }
    }
  ];

  // Declare the output event for trip selection
  @Output() tripSelected = new EventEmitter<TripDto>();

  @Output() addToMyTripsEvent = new EventEmitter<TripDto>();

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  constructor(private tripService: TripService, private router: Router) {}

  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  // This emits the selected trip to the parent (dashboard)
  onTripClick(trip: TripDto): void {
    this.tripSelected.emit(trip);
  }

  // use this if you want to navigate from inside this component
  onTripSelected(trip: TripDto) {
    this.router.navigate(['/trip/details', trip.id]);
  }
}
