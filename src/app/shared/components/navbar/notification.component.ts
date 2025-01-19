import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'BOOKING' | 'SYSTEM' | 'MESSAGE';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button 
        (click)="toggleNotifications()"
        class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <!-- Notification Badge -->
        <span *ngIf="unreadCount > 0" 
              class="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white">
        </span>
      </button>

      <!-- Dropdown -->
      <div *ngIf="isOpen" 
           class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
           #dropdown>
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
            <button *ngIf="unreadCount > 0"
                    (click)="markAllAsRead()"
                    class="text-sm text-airbnb hover:text-airbnb-dark">
              Mark all as read
            </button>
          </div>

          <div class="space-y-4 max-h-96 overflow-y-auto">
            <ng-container *ngIf="notifications.length > 0; else noNotifications">
              <div *ngFor="let notification of notifications"
                   [class.bg-gray-50]="!notification.read"
                   class="p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                   (click)="markAsRead(notification)">
                <!-- Notification Icon -->
                <div class="flex items-start space-x-3">
                  <div [ngSwitch]="notification.type" class="flex-shrink-0">
                    <!-- Booking Icon -->
                    <div *ngSwitchCase="'BOOKING'" class="p-2 bg-green-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <!-- Message Icon -->
                    <div *ngSwitchCase="'MESSAGE'" class="p-2 bg-blue-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <!-- System Icon -->
                    <div *ngSwitchCase="'SYSTEM'" class="p-2 bg-yellow-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p [class.font-semibold]="!notification.read" 
                       class="text-sm text-gray-900">
                      {{notification.message}}
                    </p>
                    <!--
                    <p class="text-xs text-gray-500 mt-1">
                      {{formatTimestamp(notification.timestamp)}}
                    </p>
                    -->
                  </div>
                </div>
              </div>
            </ng-container>
            <ng-template #noNotifications>
              <div class="text-center py-6">
                <p class="text-gray-500">No notifications</p>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --airbnb: #FF385C;
      --airbnb-dark: #E31C5F;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  isOpen = false;
  notifications: Notification[] = [];

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.fetchNotifications();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleNotifications() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.fetchNotifications();
    }
  }

  fetchNotifications() {
    const authToken = localStorage.getItem('access_token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    this.http.get<Notification[]>('http://localhost:8080/api/notifications', { headers })
      .subscribe({
        next: (data) => {
          this.notifications = data;
        },
        error: (error) => {
          console.error('Error fetching notifications:', error);
        }
      });
  }

  markAsRead(notification: Notification) {
    if (notification.read) return;

    const authToken = localStorage.getItem('access_token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    this.http.put<Notification>(`http://localhost:8080/api/notifications/${notification.id}/read`, {}, { headers })
      .subscribe({
        next: (updatedNotification) => {
          const index = this.notifications.findIndex(n => n.id === notification.id);
          if (index !== -1) {
            this.notifications[index] = { ...notification, read: true };
          }
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
  }

  markAllAsRead() {
    const authToken = localStorage.getItem('access_token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    this.http.put<void>('http://localhost:8080/api/notifications/mark-all-read', {}, { headers })
      .subscribe({
        next: () => {
          this.notifications = this.notifications.map(notification => ({
            ...notification,
            read: true
          }));
        },
        error: (error) => {
          console.error('Error marking all notifications as read:', error);
        }
      });
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}