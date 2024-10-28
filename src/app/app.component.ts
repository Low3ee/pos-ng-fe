import { Component, inject, NgModule, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WebSocketService } from './services/websocket/websocket.service';

import { Subscription } from 'rxjs';

import { CommonModule, NgFor } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NavComponent } from './views/fragments/nav/nav.component';
import { ThemeService } from './services/theme/theme-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, CommonModule, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private messagesSubscription!: Subscription;

  messages: any = [];
  newMessage: any = '';

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.messagesSubscription = this.webSocketService.getMessages().subscribe(
      (message: any) => {
        this.messages.push(message);
        console.log('Received message:', message);
      },
      (err: any) => console.error(err),
      () => console.log('WebSocket connection closed')
    );
  }

  sendMessage() {
    const message = { type: 'message', content: this.newMessage };
    this.webSocketService.sendMessage(message);
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
    this.webSocketService.close();
  }

  #theme: ThemeService = inject(ThemeService);

  switchTheme(): void {
    this.#theme.toggleTheme();
  }

  isDarkThemeActive(): boolean {
    return this.#theme.isDarkThemeActive();
  }

  getThemeToggleLabel(): string {
    return this.#theme.getToggleLabel();
  }
  title = 'fe';
}
