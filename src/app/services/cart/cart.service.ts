import { Injectable } from '@angular/core';
import { ProductsService } from '../api/products/products.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private productService: ProductsService) {}

  addToCart(itemId: string) {
    let cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    cart.push(itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart);
  }

  getCart() {
    let products = this.productService.getData();
    let cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    let items: any[] = [];

    if (cart) {   
      console.log(items);
      items = cart.map((itemId: string) => {
        return products.pipe(
          map((productList: any[]) =>
            productList.find((product: any) => product.id === itemId)
          )
        );
      });
    }
    return items;
  }
}
