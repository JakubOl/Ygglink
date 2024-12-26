import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { MatTimepickerModule } from '@angular/material/timepicker';

// Angular Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// Components and Routing
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutModule } from '@angular/cdk/layout';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { HttpClientModule } from '@angular/common/http';
import { CalendarComponent } from './components/calendar/calendar.component';
import { HomeComponent } from './components/home/home.component';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { httpInterceptorProviders } from './interceptors/http.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { StockDashboardComponent } from './components/stock-dashboard/stock-dashboard.component';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import * as echarts from 'echarts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    // ProfileComponent,
    NavbarComponent,
    EmailVerificationComponent,
    AuthLayoutComponent,
    HomeComponent,
    CalendarComponent,
    TaskDialogComponent,
    StockDashboardComponent,
    StockChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    // Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatGridListModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTimepickerModule,
    MatMenuModule,
    MatSelectModule,
    MatChipsModule,
    DragAndDropModule,
    
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),

    NgxEchartsModule.forRoot({
      echarts
    }),

    LayoutModule,
  ],
  providers: [httpInterceptorProviders, provideNativeDateAdapter()],
  bootstrap: [AppComponent]
})
export class AppModule { }