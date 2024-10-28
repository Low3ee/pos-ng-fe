import { Routes } from '@angular/router';
import { HomepageComponent } from './views/homepage/homepage.component';
import { WildcardComponent } from './views/wildcard/wildcard.component';
import { AuthComponent } from './views/auth/auth.component';
import { CustomerComponent } from './views/customer/customer.component';
import { KitchenComponent } from './views/kitchen/kitchen.component';
import { CartComponent } from './views/cart/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order/:tableID', component: CustomerComponent },
  { path: 'kitchen', component: KitchenComponent },

  // dapat last ni pirme
  { path: '**', component: WildcardComponent },
];
