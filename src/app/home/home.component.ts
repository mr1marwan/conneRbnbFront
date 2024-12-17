import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <img class="h-8 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb">
              </div>
            </div>
            <div class="flex items-center">
              <button class="bg-airbnb text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-airbnb-dark">
                Become a Host
              </button>
              <div class="ml-4 relative">
                <div class="flex items-center">
                  <button class="bg-gray-800 flex text-sm rounded-full focus:outline-none">
                    <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div class="relative max-w-7xl mx-auto">
          <div class="text-center">
            <h1 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              Find your next stay
            </h1>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Search low prices on hotels, homes and much more...
            </p>
          </div>
          
          <!-- Search Bar -->
          <div class="mt-8 max-w-3xl mx-auto">
            <div class="flex items-center justify-center">
              <div class="flex-1 min-w-0">
                <input type="text" class="block w-full px-4 py-3 rounded-l-lg border-gray-300 shadow-sm focus:ring-airbnb focus:border-airbnb" placeholder="Where are you going?">
              </div>
              <button class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-lg text-white bg-airbnb hover:bg-airbnb-dark">
                Search
              </button>
            </div>
          </div>

          <!-- Featured Listings -->
          <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            <!-- Sample listing cards -->
            <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div class="flex-shrink-0">
                <img class="h-48 w-full object-cover" src="https://images.unsplash.com/photo-1518780664697-55e3ad937233" alt="">
              </div>
              <div class="flex-1 bg-white p-6 flex flex-col justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-airbnb">Entire home</p>
                  <div class="block mt-2">
                    <p class="text-xl font-semibold text-gray-900">Luxury Villa with Ocean View</p>
                    <p class="mt-3 text-base text-gray-500">4 guests · 2 bedrooms · 2 beds · 2 baths</p>
                  </div>
                </div>
                <div class="mt-6">
                  <p class="text-xl font-semibold text-gray-900">$200 / night</p>
                </div>
              </div>
            </div>

            <!-- Add more listing cards as needed -->
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}