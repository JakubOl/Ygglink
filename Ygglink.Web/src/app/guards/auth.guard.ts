import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isLoggedIn())
    {
      // const requiredRole = route.data['role'] as string;
      
      // if (this.authService.hasRole(requiredRole)) 
        return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}