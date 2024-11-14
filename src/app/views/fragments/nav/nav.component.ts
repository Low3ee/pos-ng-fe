import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  // Declare the cart item count variable
  cartItemCount: any = 0;

  constructor(public cartService: CartService, private router: Router) {}

  ngOnInit(): void {
   const cartCountSignal = this.cartService.getCartCount();

    this.cartItemCount = cartCountSignal;
    };

  viewCart(){
    this.router.navigate(["/cart"])
  }
}