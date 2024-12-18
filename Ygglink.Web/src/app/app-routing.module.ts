import { provideRouter, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'email-verify', component: EmailVerificationComponent },
  { path: '**', component: LoginComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [provideRouter(routes), provideHttpClient()]
})
export class AppRoutingModule { }