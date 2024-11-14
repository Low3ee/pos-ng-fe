import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart$ :any; // signal for cart items
  cartCount$ :any; // signal for cart count
  totalPrice$ :any; // signal for total price

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Now cartService is available, initialize properties here
    this.cart$ = this.cartService.getCart();  // signal
    this.cartCount$ = this.cartService.getCartCount();  // signal
    // this.totalPrice$ = this.cartService.getTotalPrice();  // signal
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
    this.cartService.updateCartCount();
    
  }

  updateQuantity(itemId: string, quantity: number): void {
    this.cartService.updateProductQuantity(itemId, quantity);
    this.cartService.updateCartCount();

  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
