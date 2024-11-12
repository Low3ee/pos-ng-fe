import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  email: string;
  password: string;
  fullName?: string; // Optional for registration
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3030/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Register user
  public registerUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    }).pipe(
      tap(response => console.log('User registered successfully:', response)),
      catchError(this.handleError)
    );
  }

  // Login user
  public loginUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      withCredentials: true,
    }).pipe(
      tap(response => console.log('User logged in successfully:', response)),
      catchError(this.handleError)
    );
  }

  // Validate token and redirect user accordingly
  public validateToken(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/validate_token`, { withCredentials: true }).pipe(
      tap(response => {
        if (!response.isValid) {
          this.router.navigate(['/auth']);
        } else {
          this.router.navigate(['/']);
        }
      }),
      catchError((error) => {
        console.error('Error during token validation:', error);
        this.router.navigate(['/auth']);
        return throwError(error);
      })
    );
  }

  // Handle HTTP errors
  private handleError(error: any) {
    console.error('Error occurred:', error);
    let errorMessage = 'An unexpected error occurred. Please try again later.';

    if (error?.error?.message) {
      errorMessage = error.error.message;
    }
    else if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your network connection.';
    } else if (error.status === 404) {
      errorMessage = 'The requested resource could not be found.';
    } else if (error.status === 500) {
      errorMessage = 'An internal server error occurred. Please try again later.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
