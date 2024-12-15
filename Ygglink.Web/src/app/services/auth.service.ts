import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string; }): Observable<void> {
    return this.http
      .post<{ token: string }>(environment.AUTH_API + "login", credentials, httpOptions)
      .pipe(
        map(response => this.storeToken(response.token)),
        catchError((error: HttpErrorResponse) => throwError(error)));
  }

  register(credentials: { Email: string; Password: string; ConfirmPassword: string; }): Observable<any> {
    return this.http
      .post(environment.AUTH_API + 'register', credentials, httpOptions)
      .pipe(
        map(response => response),
        catchError((error: HttpErrorResponse) => throwError(error)));
  }

  verifyEmail(UserId: any, Token: any): Observable<any> {
    return this.http.post(environment.AUTH_API + 'verifyemail', { UserId, Token }, httpOptions);
  }

  resendVerificationToken(UserId: any): Observable<any> {
    return this.http.post<any>(environment.AUTH_API + 'resendverificationtoken', { UserId }, httpOptions);
  }

  storeToken(token: string): void {
    localStorage.removeItem(environment.TOKEN_KEY);
    localStorage.setItem(environment.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(environment.TOKEN_KEY);
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token)
      return [];

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.roles || [];
    }
    catch (e) {
      return [];
    }
  }

  getUser(): string[] {
    const token = this.getToken();
    if (!token)
      return [];

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken;
    }
    catch (e) {
      return [];
    }
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }
}
