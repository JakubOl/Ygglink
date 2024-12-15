import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-verification',
  imports: [],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent implements OnInit {
  message: string = 'Verifying your email...';
  error: string = '';
  userId: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!this.userId || !token)
    {
      this.router.navigate(['/login']);
      return;
    }
      
    return this.verifyEmail(this.userId, token);
  }

  verifyEmail(userId: string, token: string) {
    this.authService
      .verifyEmail(userId, token)
      .subscribe(
        (response) => {
          this.message = 'Your email has been successfully verified!';
        },
        (error) => {
          this.error = error.error || 'Email verification failed. The link may be invalid or expired.';
        }
      );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  
  resendVerificationEmail() {
    if (this.userId)
    {
      this.error = 'Unable to resend verification email.';
      this.message = '';
      return;
    }

    this.authService
      .resendVerificationToken(this.userId)
      .subscribe(
        (response: any) => {
          this.message = 'A new verification email has been sent to your email address.';
          this.error = '';
        },
        (error) => {
          this.error =
            error.error ||
            'Failed to resend verification email. Please try again later.';
          this.message = '';
        }
      );
  }
}
