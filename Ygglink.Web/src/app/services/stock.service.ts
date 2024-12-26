import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Stock } from '../models/stock';

export interface UserSubscription {
  id?: string;
  userId: string;
  subscribedStocks: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = environment.STOCK_API;

  constructor(private http: HttpClient) { }

  getSubscriptions(): Observable<UserSubscription[]> {
    return this.http.get<UserSubscription[]>(`${this.apiUrl}/subscriptions`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSubscriptionByUserId(userId: string): Observable<UserSubscription> {
    return this.http.get<UserSubscription>(`${this.apiUrl}/subscriptions/${userId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createSubscription(subscription: UserSubscription): Observable<UserSubscription> {
    return this.http.post<UserSubscription>(`${this.apiUrl}/subscriptions`, subscription)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateSubscription(userId: string, subscription: UserSubscription): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/subscriptions/${userId}`, subscription)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteSubscription(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/subscriptions/${userId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stocks`)
      .pipe(
        catchError(this.handleError)
      );
  }

  addStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(`${this.apiUrl}/stocks`, stock)
      .pipe(
        catchError(this.handleError)
      );
  }

  removeStock(symbol: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/stocks/${symbol}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A network error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
