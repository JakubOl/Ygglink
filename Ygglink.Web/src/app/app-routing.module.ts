import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AuthGuard } from './guards/auth.guard';
import { StockDashboardComponent } from './components/stock-dashboard/stock-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'email-verify', component: EmailVerificationComponent },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'stocks', component: StockDashboardComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent, canActivate: [AuthGuard] },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
