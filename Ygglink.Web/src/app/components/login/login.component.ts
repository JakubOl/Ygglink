import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid)
      return;

    this.errorMessage = null;

    this.authService
      .login(this.loginForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          if (error.status === 0) {
            this.errorMessage = 'Service is unavailable. Please try again later.';
          } else if (error.status === 401) {
            this.errorMessage = error.error || 'Login failed. Please try again.';
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
        }
      });
  }
}
