import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkInitialLoginState());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private apiUrl = 'http://localhost:8080/api/v1/auth'; // Update with your API URL

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private checkInitialLoginState(): boolean {
    return !!localStorage.getItem('access_token');
  }

  login(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    this.isLoggedInSubject.next(true);
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });

    return new Observable(subscriber => {
      this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe({
        next: () => {
          // Clear local storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_id');
          
          // Update logged in state
          this.isLoggedInSubject.next(false);
          
          // Navigate to home page
          this.router.navigate(['/home']);
          
          subscriber.next();
          subscriber.complete();
        },
        error: (error) => {
          // Even if the API call fails, we still want to log out locally
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_id');
          this.isLoggedInSubject.next(false);
          this.router.navigate(['/home']);
          
          subscriber.error(error);
        }
      });
    });
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}