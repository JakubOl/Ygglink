import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { Subscription, interval } from 'rxjs';
import { StockData } from '../../models/stock-data';
import { UserWatchlist } from '../../models/user-watchlist';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-dashboard',
  templateUrl: './stock-dashboard.component.html',
  styleUrls: ['./stock-dashboard.component.scss'],
  standalone: false
})
export class StockDashboardComponent implements OnInit, OnDestroy {
  stockForm: FormGroup;
  userId: string = 'user123';
  userWatchlist?: UserWatchlist;
  allStocks: { symbol: string, data: StockData[] }[] = [];
  displayedStocks: { symbol: string, data: StockData[] }[] = [];
  gridCols: number = 3;
  pageSize: number = 6;
  
  currentPage: number = 0;
  timerWatchlist!: Subscription;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private stockService: StockService, private snackBar: MatSnackBar) {
    this.stockForm = this.fb.group({
      symbol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.adjustGridCols();
    this.fetchUserWatchlist();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.adjustGridCols();
    this.updateDisplayedStocks();
  }

  fetchUserWatchlist(): void {
    this.stockService
      .getWatchlist()
      .subscribe({
        next: (userWatchlist: any) => 
        {
          this.fetchStockData(userWatchlist);
          this.isLoading = false;
        },
        error: (error) => 
        {
          this.snackBar.open(`Error fetching Watchlist: ${error}`, 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  private fetchStockData(userWatchlist: any) {
    this.stockService
      .getStocks(userWatchlist.stocks)
      .subscribe({
        next: (data: any) => 
        {
          this.allStocks = data
          this.isLoading = false;
          this.updateDisplayedStocks();
          this.resetTimer();
        },
        error: (error) => 
        {
          this.snackBar.open(`Error fetching Watchlist: ${error}`, 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  addStock(symbol: string): void {
    symbol = symbol.toUpperCase();
    if (this.allStocks.find(stock => stock.symbol === symbol)) {
      this.snackBar.open(`${symbol} is already subscribed.`, 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const updatedStocks = [...(this.userWatchlist?.stocks || []), symbol];
    const updatedWatchlist: UserWatchlist = {
      stocks: updatedStocks
    };

    this.stockService
      .updateWatchlist(updatedWatchlist)
      .subscribe({
        next: () => 
        {
          this.fetchStockData(updatedWatchlist);
        },
        error: (error) => 
        {
          this.snackBar.open(`Error adding stock to watchlist: ${error}`, 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  removeStock(symbol: string): void {
    this.isLoading = true;
    const updatedStocks = this.userWatchlist!.stocks.filter(s => s !== symbol);
    const updatedWatchlist: UserWatchlist = { stocks: updatedStocks };

    this.stockService
      .updateWatchlist(updatedWatchlist)
      .subscribe({
        next: () => 
        {
          this.userWatchlist!.stocks = updatedStocks;
          this.allStocks = this.allStocks.filter(stock => stock.symbol !== symbol);
          this.updateDisplayedStocks();
          this.isLoading = false;
        },
        error: (error) => 
        {
          this.snackBar.open(`Error removing stock: ${error}`, 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  onSubmit(): void {
    if (!this.stockForm.valid)
      return;

    const symbol = this.stockForm.value.symbol.trim();
    if (!symbol)
      return;

    this.addStock(symbol);
    this.stockForm.reset();
  }

  updateDisplayedStocks(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedStocks = this.allStocks.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedStocks();
      this.resetTimer();
    }
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.allStocks.length / this.pageSize);
    if (this.currentPage < totalPages - 1) {
      this.currentPage++;
    } else {
      this.currentPage = 0;
    }
    this.updateDisplayedStocks();
    this.resetTimer();
  }

  startAutoSlide(): void {
    this.timerWatchlist = interval(60000).subscribe(() => {
      this.nextPage();
    });
  }

  stopAutoSlide(): void {
    if (this.timerWatchlist) {
      this.timerWatchlist.unsubscribe();
    }
  }

  resetTimer(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  get totalPages(): number {
    return Math.ceil(this.allStocks.length / this.pageSize);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedStocks();
      this.resetTimer();
    }
  }

  adjustGridCols(): void {
    const width = window.innerWidth;
    if (width < 600) {
      this.gridCols = 1;
    } else if (width < 960) {
      this.gridCols = 2;
    } else {
      this.gridCols = 3;
    }
  }
}
