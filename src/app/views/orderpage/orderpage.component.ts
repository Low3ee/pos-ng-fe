import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { WebSocketService } from '../../services/websocket/websocket.service';
import { ProductsService } from '../../services/api/products/products.service';
import { NgFor } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './orderpage.component.html',
  styleUrl: './orderpage.component.css',
})
export class CustomerComponent implements OnInit {
  id: any;
  data: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private websocketService: WebSocketService,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}
  ngOnInit(): any {
    this.productsService.getData().subscribe((response: any) => {
      this.data = response;
      console.log(this.data);
    });
    console.log('Hello');
    this.id = this.route.snapshot.paramMap.get('tableID');
    console.log(this.id);
    if (this.id == localStorage.getItem('orderNumber')) {
      console.log('You are logged in and can view your order');
    } else {
      this.router.navigate(['/404']);
    }
  }

  addToCart(item: string) {
    this.cartService.addToCart(item);
    console.log('Added to cart');
  }

  sendOrder() {
    const message = { type: 'message', content: this.id };
    this.websocketService.sendMessage(message);
  }
}
