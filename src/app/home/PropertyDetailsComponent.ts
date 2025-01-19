import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';

interface Property {
  id: number;
  address: string;
  city: string;
  title: string;
  description: string;
  pricePerNight: number;
  images: string[];
}

interface BookingDates {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div *ngIf="property" class="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <!-- Image Carousel -->
        <div class="relative h-[400px]">
          <div class="absolute inset-0 flex">
            <img *ngFor="let image of property.images; let i = index"
                 [src]="image"
                 [class.hidden]="currentImageIndex !== i"
                 [class.image-fade]="true"
                 [class.active]="currentImageIndex === i"
                 class="h-full w-full object-cover"
                 [alt]="'Image ' + (i + 1) + ' of ' + property.title">
          </div>
          <!-- Navigation Arrows -->
          <div class="absolute inset-0 flex items-center justify-between p-4" *ngIf="property.images.length > 1">
            <button (click)="previousImage()" 
                    class="nav-button p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb"
                    aria-label="Previous image">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button (click)="nextImage()" 
                    class="nav-button p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb"
                    aria-label="Next image">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <!-- Image Counter -->
          <div class="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">
            {{currentImageIndex + 1}} / {{property.images.length}}
          </div>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{property.title}}</h1>
              <div class="flex items-center space-x-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-lg">{{property.city}}, {{property.address}}</p>
              </div>
            </div>

            <div class="border-t border-b border-gray-200 py-4">
              <p class="text-gray-700 text-base leading-relaxed">{{property.description}}</p>
            </div>

            <div class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold text-gray-900">{{property.pricePerNight}} dh</span>
                <span class="text-gray-600">per night</span>
              </div>
              <button (click)="showBookingModal = true" 
                      class="book-button w-full sm:w-auto bg-airbnb text-white font-semibold py-3 px-6 rounded-lg hover:bg-airbnb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Modal -->
      <div *ngIf="showBookingModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="showBookingModal = false">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
             (click)="$event.stopPropagation()">
          <div class="mt-3">
            <h3 class="text-2xl font-semibold text-gray-900 mb-6">Book Your Stay</h3>
            <form (submit)="handleBooking($event)" class="space-y-6">
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                <input type="date" 
                       id="startDate" 
                       name="startDate"
                       [(ngModel)]="bookingDates.startDate"
                       [min]="today"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-airbnb"
                       required>
              </div>
              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                <input type="date" 
                       id="endDate" 
                       name="endDate"
                       [(ngModel)]="bookingDates.endDate"
                       [min]="bookingDates.startDate || today"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-airbnb"
                       required>
              </div>
              
              <div *ngIf="calculateTotalPrice() > 0" class="border-t pt-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-600">{{calculateNights()}} nights</span>
                  <span class="text-gray-900">{{property?.pricePerNight}} dh × {{calculateNights()}}</span>
                </div>
                <div class="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span>{{calculateTotalPrice()}} dh</span>
                </div>
              </div>

              <div class="flex justify-end space-x-4">
                <button type="button"
                        (click)="showBookingModal = false"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  Cancel
                </button>
                <button type="submit"
                        class="px-4 py-2 bg-airbnb text-white rounded-md hover:bg-airbnb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div *ngIf="!property" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center space-y-4">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-airbnb border-t-transparent mx-auto"></div>
          <p class="text-lg text-gray-600 font-medium">Loading property details...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      --airbnb: #FF385C;
      --airbnb-dark: #E31C5F;
    }
  `]
})
export class PropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  currentImageIndex: number = 0;
  showBookingModal = false;
  bookingDates: BookingDates = {
    startDate: '',
    endDate: ''
  };
  today = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.fetchPropertyDetails(id);
    });
  }

  fetchPropertyDetails(id: number) {
    this.http.get<Property>(`http://localhost:8080/api/properties/${id}`)
      .subscribe({
        next: (data) => {
          this.property = data;
        },
        error: (error) => {
          console.error('Error fetching property details:', error);
        }
      });
  }

  nextImage() {
    if (this.property) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.property.images.length;
    }
  }

  previousImage() {
    if (this.property) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.property.images.length) % this.property.images.length;
    }
  }

  calculateNights(): number {
    if (!this.bookingDates.startDate || !this.bookingDates.endDate) return 0;
    const start = new Date(this.bookingDates.startDate);
    const end = new Date(this.bookingDates.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateTotalPrice(): number {
    const nights = this.calculateNights();
    return nights * (this.property?.pricePerNight || 0);
  }

  handleBooking(event: Event) {
    event.preventDefault();
    if (this.property) {
      const authToken = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');

      if (!authToken || !userId) {
        console.error('No auth token or user ID found');
        // You might want to show an error message to the user here
        return;
      }

      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${authToken}`);

      const bookingData = {
        propertyId: this.property.id,
        startDate: this.bookingDates.startDate,
        endDate: this.bookingDates.endDate,
        userId: userId // Include the user ID in the booking data
      };

      this.http.post('http://localhost:8080/api/bookings/reserve', bookingData, { headers })
        .subscribe({
          next: (response) => {
            console.log('Booking successful:', response);
            this.showBookingModal = false;
            this.bookingDates = {
              startDate: '',
              endDate: ''
            };
            // You might want to show a success message to the user here
          },
          error: (error) => {
            console.error('Error making booking:', error);
            if (error.error instanceof Error) {
              console.error('Parsing error:', error.error);
            }
            // You might want to show an error message to the user here
          }
        });
    }
  }
}

bootstrapApplication(PropertyDetailsComponent);

