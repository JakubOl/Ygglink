import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string  = 'Registration successful! Please check your email to verify your account before logging in.';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    private fb: FormBuilder) {

    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    if (!this.registerForm.valid)
      return;

    this.errorMessage = '';
    this.isLoading = true;
    this.authService
      .register(this.registerForm.value)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! Please check your email to verify your account before logging in.';
          this.registerForm.reset();
        },
        error: error => {
          this.isLoading = false;
          if (error.status === 0) {
            this.errorMessage = 'Service is unavailable. Please try again later.';
          } else {
            this.errorMessage = error.error || 'An unexpected error occurred.';
          }
        }
      });
  }
}
