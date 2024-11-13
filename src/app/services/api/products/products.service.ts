import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  data: any;
  private apiUrl = 'http://localhost:3030/products';

  constructor(private http: HttpClient, private router: Router) {}

  getData(): Observable<any> {
    return this.http.get('assets/product.json');
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`)
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, product)
  }

  
}
