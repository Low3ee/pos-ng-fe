import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  constructor(private cartService: CartService) {}
  cart: any;
  ngOnInit(): void {
    this.cart = this.cartService.getCart() ? this.cartService.getCart() : [];
  }
}
