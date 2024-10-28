import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../services/websocket/websocket.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [NgIf],
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css'],
})
export class KitchenComponent implements OnInit, OnDestroy {
  private websocketSubscription: Subscription | undefined;
  message: any;
  orders: string[] = [];
  orderBuzz = new Audio('audio/order-buzz.mp3');
  isInitialized = false;

  constructor(private websocketService: WebSocketService) {}

  ngOnInit() {
    this.websocketSubscription = this.websocketService
      .getMessages()
      .subscribe((data: any) => {
        this.message = data;
        console.log('WebSocket message received:', data);
        const customerIdElement = document.getElementById('customerId');
        if (customerIdElement && data.content) {
          if (this.isInitialized) {
            this.orderBuzz.play();
          }
          this.orders.push(data.content);
          customerIdElement.innerHTML = `order queue ${this.orders}`;
        }
      });
  }

  ngOnDestroy() {
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }
  }

  initializeAudio() {
    this.orderBuzz
      .play()
      .then(() => {
        this.orderBuzz.pause();
        this.orderBuzz.currentTime = 0;
        this.isInitialized = true;
      })
      .catch((error) => {
        console.error('Audio initialization failed:', error);
      });
  }
}
