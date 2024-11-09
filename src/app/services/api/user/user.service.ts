import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}
  private apiUrl = 'http://localhost:3030/auth';
  private headers = new HttpHeaders().set(
    'Content-Type',
    'application/json; charset=utf-8'
  );
  public registerUser(user: any): Observable<any> {
    console.log(user);
    return this.http.post<any>(`${this.apiUrl}/register`, user, {
      headers: this.headers,
    });
  }

  public loginUser(user: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, user, {
      headers: this.headers,
      withCredentials: true,
    });
}


public validateToken() {
  this.http
    .get<any>(`${this.apiUrl}/validate_token`, { withCredentials: true }) 
    .subscribe(
      (response) => {
        console.log('response:', response);
        if (!response.isValid) {
          this.router.navigate(['/auth']);
        }
        this.router.navigate(['/'])
        
      },
      (error) => {
        console.log('Error during request:', error);
        this.router.navigate(['/auth']);
      }
    );
}

}
