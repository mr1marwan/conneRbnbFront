import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service'; // Add this import
import { Router } from '@angular/router'; // Add this import

interface Property {
  id: number;
  address: string;
  city: string;
  title: string;
  description: string;
  bedrooms: number;
  pricePerNight: number;
  images: string[];
  averageRating?: number;
  reviews: Review[];
}

interface Review {
  id: number;
  propertyId: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
  userName: string;
}

interface ReviewRequest {
  propertyId: number;
  rating: number;
  comment: string;
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
              <div class="flex justify-between items-start">
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
                <div class="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="text-lg font-semibold">{{property.averageRating?.toFixed(1) || 'New'}}</span>
                </div>
              </div>
            </div>

            <div class="border-t border-b border-gray-200 py-4">
              <p class="text-gray-700 text-base leading-relaxed">{{property.description}}</p>
            </div>
            
            <div class="flex items-center space-x-4 py-4 border-b border-gray-200">
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span class="text-gray-700">{{property.bedrooms}} rooms</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold text-gray-900">{{property.pricePerNight}} dh</span>
                <span class="text-gray-600">per night</span>
              </div>
              <button (click)="handleBookNow()" 
                      class="book-button w-full sm:w-auto bg-airbnb text-white font-semibold py-3 px-6 rounded-lg hover:bg-airbnb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
                Book Now
              </button>
            </div>

            <!-- Reviews Section -->
            <div class="mt-8">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900">Reviews</h2>
                <button (click)="handleWriteReview()"
                        class="px-4 py-2 bg-airbnb text-white rounded-md hover:bg-airbnb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
                  Write a Review
                </button>
              </div>

              <!-- Reviews List -->
              <div class="space-y-4">
                <div *ngFor="let review of property.reviews" class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-semibold text-gray-900">{{review.userName}}</p>
                      <p class="text-sm text-gray-500">{{review.createdAt | date}}</p>
                    </div>
                    <div class="flex">
                      <ng-container *ngFor="let star of [1,2,3,4,5]">
                        <svg [class.text-yellow-400]="star <= review.rating"
                             [class.text-gray-300]="star > review.rating"
                             class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </ng-container>
                    </div>
                  </div>
                  <p class="text-gray-700">{{review.comment}}</p>
                </div>
              </div>
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

      <!-- Review Modal -->
      <div *ngIf="showReviewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
           (click)="showReviewModal = false">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
             (click)="$event.stopPropagation()">
          <div class="mt-3">
            <h3 class="text-2xl font-semibold text-gray-900 mb-6">Write a Review</h3>
            <form (submit)="handleReviewSubmit($event)" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div class="flex space-x-1">
                  <button type="button"
                          *ngFor="let star of [1,2,3,4,5]"
                          (click)="newReview.rating = star"
                          class="focus:outline-none">
                    <svg [class.text-yellow-400]="star <= newReview.rating"
                         [class.text-gray-300]="star > newReview.rating"
                         class="h-8 w-8 transition-colors duration-150" 
                         xmlns="http://www.w3.org/2000/svg" 
                         viewBox="0 0 20 20" 
                         fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea id="comment"
                          name="comment"
                          [(ngModel)]="newReview.comment"
                          rows="4"
                          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-airbnb"
                          required></textarea>
              </div>

              <div class="flex justify-end space-x-4">
                <button type="button"
                        (click)="showReviewModal = false"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  Cancel
                </button>
                <button type="submit"
                        class="px-4 py-2 bg-airbnb text-white rounded-md hover:bg-airbnb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
                  Submit Review
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

    .image-fade {
      transition: opacity 0.3s ease-in-out;
    }

    .image-fade:not(.active) {
      opacity: 0;
    }

    .image-fade.active {
      opacity: 1;
    }

    .nav-button {
      transition: transform 0.2s ease-in-out;
    }

    .nav-button:hover {
      transform: scale(1.1);
    }

    .book-button {
      transition: all 0.2s ease-in-out;
    }

    .book-button:hover {
      transform: translateY(-2px);
    }
  `]
})
export class PropertyDetailsComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/api';
  property: Property | null = null;
  currentImageIndex: number = 0;
  showBookingModal = false;
  showReviewModal = false;
  bookingDates: BookingDates = {
    startDate: '',
    endDate: ''
  };
  newReview: ReviewRequest = {
    propertyId: 0,
    rating: 0,
    comment: ''
  };
  today = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.fetchPropertyDetails(id);
      this.fetchPropertyReviews(id);
    });
  }

  fetchPropertyDetails(id: number) {
    this.http.get<Property>(`${this.apiUrl}/properties/${id}`)
      .subscribe({
        next: (data) => {
          this.property = { ...data, reviews: [] }; // Initialize with empty reviews
        },
        error: (error) => {
          console.error('Error fetching property details:', error);
        }
      });
  }

  fetchPropertyReviews(propertyId: number) {
    this.http.get<Review[]>(`${this.apiUrl}/reviews/property/${propertyId}`)
      .subscribe({
        next: (reviews) => {
          if (this.property) {
            this.property.reviews = reviews;
            this.calculateAverageRating();
          }
        },
        error: (error) => {
          console.error('Error fetching property reviews:', error);
        }
      });
  }

  calculateAverageRating() {
    if (this.property && this.property.reviews.length > 0) {
      const sum = this.property.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.property.averageRating = sum / this.property.reviews.length;
    }
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
        return;
      }

      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${authToken}`);

      const bookingData = {
        propertyId: this.property.id,
        startDate: this.bookingDates.startDate,
        endDate: this.bookingDates.endDate,
        userId: userId
      };

      this.http.post(`${this.apiUrl}/bookings/reserve`, bookingData, { headers })
        .subscribe({
          next: (response) => {
            console.log('Booking successful:', response);
            this.showBookingModal = false;
            this.bookingDates = {
              startDate: '',
              endDate: ''
            };
          },
          error: (error) => {
            console.error('Error making booking:', error);
          }
        });
    }
  }

  handleReviewSubmit(event: Event) {
    event.preventDefault();
    if (this.property) {
      const authToken = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');

      if (!authToken || !userId) {
        console.error('No auth token or user ID found');
        return;
      }

      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${authToken}`);

      this.newReview.propertyId = this.property.id;

      this.http.post<Review>(`${this.apiUrl}/reviews`, this.newReview, { headers })
        .subscribe({
          next: (response) => {
            console.log('Review submitted successfully:', response);
            this.showReviewModal = false;
            this.newReview = {
              propertyId: this.property!.id,
              rating: 0,
              comment: ''
            };
            // Refresh property reviews to show the new review
            this.fetchPropertyReviews(this.property!.id);
          },
          error: (error) => {
            console.error('Error submitting review:', error);
          }
        });
    }
  }

  // Optional: Methods for updating and deleting reviews if needed
  updateReview(reviewId: number, updatedReview: Review) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

    this.http.put<Review>(`${this.apiUrl}/reviews/${reviewId}`, updatedReview, { headers })
      .subscribe({
        next: (response) => {
          console.log('Review updated successfully:', response);
          this.fetchPropertyReviews(this.property!.id);
        },
        error: (error) => {
          console.error('Error updating review:', error);
        }
      });
  }

  deleteReview(reviewId: number) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

    this.http.delete(`${this.apiUrl}/reviews/${reviewId}`, { headers })
      .subscribe({
        next: () => {
          console.log('Review deleted successfully');
          this.fetchPropertyReviews(this.property!.id);
        },
        error: (error) => {
          console.error('Error deleting review:', error);
        }
      });
  }

  handleBookNow() {
    if (this.authService.isLoggedIn()) {
      this.showBookingModal = true;
    } else {
      this.router.navigate(['/login']);
    }
  }
  handleWriteReview() {
    if (this.authService.isLoggedIn()) {
      this.showReviewModal = true;
    } else {
      this.router.navigate(['/login']);
    }
  }
}

bootstrapApplication(PropertyDetailsComponent);