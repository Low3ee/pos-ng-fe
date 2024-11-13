import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';  
import { Router } from '@angular/router';
import { UserService } from '../../services/api/user/user.service';
import { NgIf, NgStyle } from '@angular/common';
import { ThemeService } from '../../services/theme/theme-service.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgStyle],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  showLogin = true;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isDarkTheme: boolean =  document.documentElement.getAttribute('data-theme') == 'dark' ? true : false;

  #theme: ThemeService = inject(ThemeService);

  registerForm: FormGroup;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      _password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.isDarkTheme = this.#theme.isDarkThemeActive();
  }

  toggleView() {
    this.showLogin = !this.showLogin;
    this.errorMessage = null;
    this.successMessage = null;
  }

  // Register user
  registerUser() {
    const user = this.registerForm.value;
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.loading = true;
    this.userService.registerUser(user).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          this.loginForm.setValue({
            email: user.email,
            _password: user.password,
          });
          this.showLogin = true;
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error?.message || 'An error occurred during registration. Please try again.';
      }
    );
  }

  // Login user
  loginUser() {
    const user = this.loginForm.value;
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.loading = true;
    this.userService.loginUser(user).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = 'Login successful!';
          this.router.navigate(['/']);
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error?.message || 'Invalid credentials. Please try again.';
      }
    );
  }

  // Helper function to check form field validity
  getFieldErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (control?.hasError('required')) {
      return `${field} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
}
