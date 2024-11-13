import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from '../../services/websocket/websocket.service';
import { ProductsService } from '../../services/api/products/products.service';
import { NgFor, NgIf } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './orderpage.component.html',
  styleUrls: ['./orderpage.component.css'],
})
export class CustomerComponent implements OnInit {
  id: any;
  data: any;
  loading: boolean = true; // Add a loading state
  filteredData: any; // For filtering products by category
  categories: string[] = ['COFFEE', 'TEA', 'PASTRY', 'DESSERT']; // Assuming categories are defined
  cartEmpty: boolean = true; // Track if the cart is empty

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private websocketService: WebSocketService,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): any {
    // Fetch all products
    this.productsService.getAll().subscribe(
      (response: any) => {
        this.data = response;
        this.filteredData = response; // Default to showing all products
        this.loading = false; // Set loading to false once data is fetched
        console.log(this.data);
      },
      (error) => {
        this.loading = false; // Stop loading in case of an error
        console.error('Error fetching products:', error);
      }
    );

    // Get table ID from route params
    this.id = this.route.snapshot.paramMap.get('tableID');
    console.log(this.id);

    if (this.id === localStorage.getItem('orderNumber')) {
      console.log('You are logged in and can view your order');
    } else {
      this.router.navigate(['/404']);
    }

    // Subscribe to cart updates to check if cart is empty
    this.cartService.getCart().subscribe((cartItems) => {
      this.cartEmpty = cartItems.length === 0; // If cart is empty, set cartEmpty to true
    });
  }

  // Add item to the cart
  addToCart(itemId: string) {
    this.cartService.addToCart(itemId); // Add item to local storage
    console.log('Added to cart');

    // Update cartEmpty status based on cart contents
    this.cartService.getCart().subscribe((cartItems) => {
      this.cartEmpty = cartItems.length === 0; // Check if the cart is empty
    });
  }

  // Send order via WebSocket
  sendOrder() {
    const message = { type: 'message', content: this.id };
    this.websocketService.sendMessage(message);
  }

  // Filter products by category
  filterByCategory(category: string) {
    this.filteredData = this.data.filter((product: any) => product.category === category);
  }

  // Reset filter and show all products
  resetFilter() {
    this.filteredData = this.data;
  }
}
