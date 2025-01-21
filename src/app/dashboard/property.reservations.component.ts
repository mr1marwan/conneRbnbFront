import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Booking {
  id: number;
  propertyName: string;
  clientName: string;
  clientEmail: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

@Component({
  selector: 'app-property-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property.reservations.component.html'
})
export class PropertyReservationsComponent implements OnInit {
  propertyId: number = 0;
  bookings: Booking[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'];
      this.fetchBookings();
    });
  }

  fetchBookings() {
    const authToken = localStorage.getItem('access_token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    this.http.get<Booking[]>(`http://localhost:8080/api/properties/${this.propertyId}/bookings`, { headers })
      .subscribe({
        next: (data) => {
          this.bookings = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching bookings:', error);
          this.isLoading = false;
        }
      });
  }

  updateBookingStatus(bookingId: number, status: 'ACCEPTED' | 'DECLINED') {
    const authToken = localStorage.getItem('access_token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    this.http.put<Booking>(
      `http://localhost:8080/api/bookings/${bookingId}/status`,
      { status },
      { headers }
    ).subscribe({
      next: (updatedBooking) => {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          this.bookings[index] = updatedBooking;
        }
        this.fetchBookings(); // Refresh the bookings list
      },
      error: (error) => {
        console.error('Error updating booking status:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
