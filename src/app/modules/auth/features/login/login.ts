import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../common/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  emailError: string | null = null;
  passwordError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    this.emailError = null;
    this.passwordError = null;

    if (this.loginForm.invalid) {
      const emailControl = this.loginForm.get('email');
      const passwordControl = this.loginForm.get('password');

      if (emailControl?.errors) {
        if (emailControl.errors['required']) {
          this.emailError = 'Email is required';
        } else if (emailControl.errors['email']) {
          this.emailError = 'Invalid email format';
        }
      }

      if (passwordControl?.errors?.['required']) {
        this.passwordError = 'Password is required';
      }

      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        this.authService.setUser(res.user, res.accessToken, res.refreshToken);

        if (res.user.role === 'Admin') {
          this.router.navigate(['/admin/homepage']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        const message = err?.error?.error || err?.error?.message || 'Invalid credentials';

        if (message.toLowerCase().includes('email')) {
          this.emailError = message;
        } else if (message.toLowerCase().includes('password')) {
          this.passwordError = message;
        } else {
          this.emailError = 'Invalid email or password';
          this.passwordError = 'Invalid email or password';
        }
      }
    });
  }
}
