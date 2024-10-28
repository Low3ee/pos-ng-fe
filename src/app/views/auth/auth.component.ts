import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/api/user/user.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  showLogin = true;
  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      _password: ['', Validators.required],
    });
  }

  registerForm: FormGroup;
  loginForm: FormGroup;

  ngOnInit(): void {}

  toggleView() {
    this.showLogin = !this.showLogin;
  }

  registerUser() {
    let user = this.registerForm.value;
    // if (this.registerForm.valid) {
    this.userService.registerUser(user).subscribe((response: any) => {
      console.log(response);
      if (response.success) {
        // this.router.navigate(['/']);
        this.loginForm.setValue({
          email: user.email,
          password: user.password,
        });
        this.loginUser();
      }
    });
    // }
  }

  loginUser() {
    let user = this.loginForm.value;
    console.log(user);
    this.userService.loginUser(user).subscribe((response: any) => {
      console.log(response);
      if (response.success) {
        console.log('success');
        this.router.navigate(['/']);
      }
    });
  }
}
