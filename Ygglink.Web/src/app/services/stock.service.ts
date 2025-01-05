import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserWatchlist } from '../models/user-watchlist';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = environment.STOCK_API;

  constructor(private http: HttpClient) { }

  getWatchlist(): Observable<UserWatchlist[]> {
    return this.http
      .get<UserWatchlist[]>(`${this.apiUrl}/userwatchlist`, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateWatchlist(userWatchlist: UserWatchlist): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/userwatchlist`, userWatchlist, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getStocks(stocks: string[]): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stocks`, { ...httpOptions, params: { stocks }})
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
