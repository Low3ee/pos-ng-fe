import { Injectable, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../api/products/products.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: { productId: string; quantity: number }[] = [];
  private productsCache: any[] = [];
  private _cartCount = signal<number>(this.cart.reduce((count, item) => count + item.quantity, 0));  // signal for cart count
  private _cartItems = signal<{ productId: string, quantity: number }[]>(this.cart);  // signal for cart items

  constructor(private productService: ProductsService) {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this._cartItems.set(this.cart);  // update cart signal with the stored items
      this.updateCartCount();
    }

    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.productsCache = JSON.parse(storedProducts);
    } else {
      this.fetchProducts();
    }
  }

  // Getter for cart count signal (returns observable)
  getCartCount(): WritableSignal<number> {
    return this._cartCount;
  }

  // Getter for cart items signal (returns observable)
  getCart(): WritableSignal<{ productId: string, quantity: number }[]> {
    return this._cartItems;
  }

  addToCart(itemId: string, quantity: number = 1): void {
    const existingItem = this.cart.find((item) => item.productId === itemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ productId: itemId, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this._cartItems.set(this.cart);  // Update cart signal
    this.updateCartCount();
  }

  updateProductQuantity(itemId: string, quantity: number): void {
    const existingItem = this.cart.find((item) => item.productId === itemId);
    if (existingItem) {
      existingItem.quantity = quantity;
      if (existingItem.quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this._cartItems.set(this.cart);  // Update cart signal
        this.updateCartCount();
      }
    }
  }

  // // This method calculates the total price of the items in the cart
  // getTotalPrice(): WritableSignal<number> {
  //   const total = this.cart.reduce((total, product) => total + product.price * product.quantity, 0);
  //   const totalPriceSignal = signal<number>(total);
  //   return totalPriceSignal;
  // }

  removeFromCart(itemId: string): void {
    this.cart = this.cart.filter((item) => item.productId !== itemId);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this._cartItems.set(this.cart);  // Update cart signal
    this.updateCartCount();
  }

  clearCart(): void {
    this.cart = [];
    localStorage.removeItem('cart');
    this._cartItems.set(this.cart);  
    this.updateCartCount();
  }

   updateCartCount(): void {
    this._cartCount.set(this.cart.reduce((count, item) => count + item.quantity, 0));
  }

  private fetchProducts(): Observable<any> {
    return this.productService.getData().pipe(
      map((products: any[]) => {
        this.productsCache = products;
        localStorage.setItem('products', JSON.stringify(products));
      }),
      catchError((error) => {
        console.error('Error fetching products from API:', error);
        throw error;
      })
    );
  }
}
