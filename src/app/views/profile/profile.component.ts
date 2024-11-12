import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/api/user/user.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
// import { StripeService } from '../../services/stripe.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, NgIf, NgFor, NgClass]
})
export class ProfileComponent implements OnInit {
  activeTab: string = 'profile';
  profileForm: FormGroup;
  paymentMethods: any[] = [
    {
      brand: 'MasterCard',
      last4: '3456',
      id: '12'
    },
    {
      brand: 'Visa',
      last4: '7890',
      id: '13'
    }
  ];
  loading = false;
  orders: any[] = [
    {
      id:'123',
      date:'June 12, 2024',
      totalAmount: this.formatAsPHPCurrency(23560)
    }
  ];
  isEditing = false;  // Flag to toggle between view and edit modes

  // Sample user data (this would be fetched from your API in a real app)
  profile = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    // private stripeService: StripeService,
    private router: Router
  ) {
    // Initialize the form
    this.profileForm = this.fb.group({
      fullName: [this.profile.fullName, Validators.required],
      email: [this.profile.email, [Validators.required, Validators.email]],
      phone: [this.profile.phone, Validators.required],
    });
  }

  ngOnInit(): void {
    // Load user data (this should ideally come from your user service)
    this.loadUserProfile();
    // this.loadPaymentMethods();
  }

  formatAsPHPCurrency(amount:any) {
    const formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  
    return formatter.format(amount);
  }

  // Toggle between edit and view mode
  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form values when canceling edit mode
      this.profileForm.setValue({
        fullName: this.profile.fullName,
        email: this.profile.email,
        phone: this.profile.phone,
      });
    }
  }

  // Fetch user profile data (mocked for now)
  loadUserProfile() {
    // In a real app, you would fetch this data from your API:
    // this.userService.getProfile().subscribe((profile: any) => {
    //   this.profile = profile;
    //   this.profileForm.setValue({
    //     fullName: profile.fullName,
    //     email: profile.email,
    //     phone: profile.phone,
    //   });
    // });
  }

  // Handle profile update
  updateProfile() {
    console.log('testing');
    // if (this.profileForm.invalid) {
    //   return;
    // }

    // this.loading = true;
    // const updatedProfile = this.profileForm.value;
    // this.userService.updateProfile(updatedProfile).subscribe(
    //   (response) => {
    //     this.loading = false;
    //     this.profile = updatedProfile; // Update the profile with new data
    //     alert('Profile updated successfully!');
    //     this.toggleEditMode();  // Exit edit mode
    //   },
    //   (error) => {
    //     this.loading = false;
    //     alert('Error updating profile.');
    //   }
    // );
  }

   // View the details of a specific order
   viewOrderDetails(orderId: string) {
    console.log('testing');
    // this.router.navigate([`/orders/${orderId}`]);
  }

  // Check if the user has any payment methods
  hasPaymentMethods() {
    return this.paymentMethods && this.paymentMethods.length > 0;
  }

  // Handle adding a new card using Stripe
  addCard() {
    console.log('Add Card functionality');
    // Implement Stripe or payment gateway logic here
  }

  // Handle removing a payment method
  removeCard(cardId: string) {
    console.log('Remove Card functionality');
    // Implement Stripe or payment gateway logic here
  }
}
