import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../common/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup implements OnInit {
  signupForm!: FormGroup;

  message: string = '';
  isError: boolean = false;

  passwordHasMinLength: boolean = false;
  passwordHasNumber: boolean = false;
  passwordHasUppercase: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Subscribe to password changes to evaluate strength
    this.signupForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordStrength(value);
    });
  }

  onSignup(): void {
    this.isError = false;
    this.message = '';

    if (this.signupForm.invalid) {
      this.isError = true;
      this.message = 'All fields are required and must be valid.';
      return;
    }

    const { name, email, password } = this.signupForm.value;

    this.authService.signup(name.trim(), email.trim(), password).subscribe({
      next: () => {
        this.isError = false;
        this.message = 'Profile created successfully! You can now login.';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        console.error('Signup error:', err);
        this.isError = true;
        this.message = 'Signup failed: ' + (err.error?.message || 'User Exists');
      }
    });
  }

  checkPasswordStrength(password: string): void {
    this.passwordHasMinLength = password.length >= 6;
    this.passwordHasNumber = /\d/.test(password);
    this.passwordHasUppercase = /[A-Z]/.test(password);
  }
}
