import { Injectable } from '@angular/core';
import { ProductsService } from '../api/products/products.service';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: string[] = [];
  private productsCache: any[] = []; // Cache products to avoid multiple API calls

  constructor(private productService: ProductsService) {
    // Initialize cart and products cache from localStorage on service instantiation
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }

    // Cache product list if available in the local storage or fetch fresh data
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.productsCache = JSON.parse(storedProducts);
    } else {
      this.fetchProducts();
    }
  }

  // Add an item to the cart
  addToCart(itemId: string): void {
    // Check if item already exists in the cart to prevent duplicates
    if (!this.cart.includes(itemId)) {
      this.cart.push(itemId);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    console.log('Item added to cart:', itemId);
  }

  // Get cart items with product details
  getCart(): Observable<any[]> {
    if (this.productsCache.length === 0) {
      // If products are not cached, fetch from API and update cache
      return this.fetchProducts().pipe(
        mergeMap(() => this.getCartItems()), // MergeMap will flatten the observable
        catchError((error) => {
          console.error('Error fetching products', error);
          return []; // Return empty array in case of an error
        })
      );
    } else {
      // If products are cached, directly return cart items
      return this.getCartItems();
    }
  }

  // Private method to fetch products from API and cache them
  private fetchProducts(): Observable<any> {
    return this.productService.getData().pipe(
      map((products: any[]) => {
        this.productsCache = products;
        localStorage.setItem('products', JSON.stringify(products));
      }),
      catchError((error) => {
        console.error('Error fetching products from API:', error);
        throw error; // Rethrow error to handle in getCart()
      })
    );
  }

  // Private method to get cart items from the cached products
  private getCartItems(): Observable<any[]> {
    return forkJoin(
      this.cart.map((itemId) => {
        return this.productService.getData().pipe(
          map((products: any[]) =>
            products.find((product) => product.id === itemId)
          ),
          catchError(() => {
            console.error('Error fetching product with id:', itemId);
            return []; // Return an empty array if product fetch fails
          })
        );
      })
    ).pipe(
      map((productArray) => productArray.filter((product) => product !== null))
    );
  }

  // Remove an item from the cart
  removeFromCart(itemId: string): void {
    this.cart = this.cart.filter((id) => id !== itemId);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    console.log('Item removed from cart:', itemId);
  }

  // Clear the entire cart
  clearCart(): void {
    this.cart = [];
    localStorage.removeItem('cart');
    console.log('Cart cleared');
  }

  // Get the number of items in the cart
  getCartCount(): number {
    return this.cart.length;
  }

  // Get the total price of the items in the cart
  getTotalPrice(): Observable<number> {
    return this.getCart().pipe(
      map((cartItems) => {
        return cartItems.reduce((total, product) => total + product.price, 0);
      })
    );
  }
}
