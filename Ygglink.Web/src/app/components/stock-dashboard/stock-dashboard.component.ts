import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockService, UserSubscription } from '../../services/stock.service';
import { Subscription, interval } from 'rxjs';
import { StockData } from '../../models/stock-data';

@Component({
  selector: 'app-stock-dashboard',
  templateUrl: './stock-dashboard.component.html',
  styleUrls: ['./stock-dashboard.component.scss'],
  standalone: false
})
export class StockDashboardComponent implements OnInit, OnDestroy {
  stockForm: FormGroup;
  userId: string = 'user123';
  userSubscription?: UserSubscription;
  allStocks: { symbol: string, data: StockData[] }[] = [];
  displayedStocks: { symbol: string, data: StockData[] }[] = [];
  gridCols: number = 3;
  pageSize: number = 6;
  currentPage: number = 0;
  timerSubscription!: Subscription;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private stockService: StockService) {
    this.stockForm = this.fb.group({
      symbol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.adjustGridCols();
    this.fetchUserSubscription();
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

  fetchUserSubscription(): void {
    this.isLoading = true;
    this.stockService.getSubscriptionByUserId(this.userId).subscribe(
      (subscription: UserSubscription) => {
        this.userSubscription = subscription;
        this.allStocks = subscription.subscribedStocks.map(symbol => ({
          symbol,
          data: this.generateDummyData()
        }));
        this.updateDisplayedStocks();
        this.isLoading = false;
      },
      (error) => {
        if (error.status === 404) {
          this.createUserSubscription();
        } else {
          alert(`Error fetching subscription: ${error}`);
          this.isLoading = false;
        }
      }
    );
  }

  createUserSubscription(): void {
    const newSubscription: UserSubscription = {
      userId: this.userId,
      subscribedStocks: []
    };

    this.stockService.createSubscription(newSubscription).subscribe(
      (createdSubscription: UserSubscription) => {
        this.userSubscription = createdSubscription;
        this.allStocks = [];
        this.updateDisplayedStocks();
        this.isLoading = false;
      },
      (error) => {
        alert(`Error creating subscription: ${error}`);
        this.isLoading = false;
      }
    );
  }

  addStock(symbol: string): void {
    symbol = symbol.toUpperCase();
    if (this.allStocks.find(stock => stock.symbol === symbol)) {
      alert(`${symbol} is already subscribed.`);
      return;
    }

    this.isLoading = true;
    const updatedStocks = [...(this.userSubscription?.subscribedStocks || []), symbol];
    const updatedSubscription: UserSubscription = {
      userId: this.userId,
      subscribedStocks: updatedStocks
    };

    this.stockService.updateSubscription(this.userId, updatedSubscription).subscribe(
      () => {
        this.userSubscription!.subscribedStocks.push(symbol);
        this.allStocks.push({ symbol, data: this.generateDummyData() });
        this.updateDisplayedStocks();
        this.isLoading = false;
        this.resetTimer();
      },
      (error) => {
        alert(`Error adding stock: ${error}`);
        this.isLoading = false;
      }
    );
  }

  removeStock(symbol: string): void {
    this.isLoading = true;
    const updatedStocks = this.userSubscription!.subscribedStocks.filter(s => s !== symbol);
    const updatedSubscription: UserSubscription = {
      userId: this.userId,
      subscribedStocks: updatedStocks
    };

    this.stockService.updateSubscription(this.userId, updatedSubscription).subscribe(
      () => {
        this.userSubscription!.subscribedStocks = updatedStocks;
        this.allStocks = this.allStocks.filter(stock => stock.symbol !== symbol);
        this.updateDisplayedStocks();
        this.isLoading = false;
      },
      (error) => {
        alert(`Error removing stock: ${error}`);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.stockForm.valid) {
      const symbol = this.stockForm.value.symbol.trim();
      if (symbol) {
        this.addStock(symbol);
        this.stockForm.reset();
      }
    }
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
    this.timerSubscription = interval(60000).subscribe(() => {
      this.nextPage();
    });
  }

  stopAutoSlide(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  resetTimer(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  generateDummyData(): StockData[] {
    const data: StockData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = `${date.getMonth() + 1}/${date.getDate()}`;

      const open = this.randomNumber(100, 500);
      const close = open + this.randomNumber(-20, 20);
      const low = Math.min(open, close) - this.randomNumber(0, 10);
      const high = Math.max(open, close) + this.randomNumber(0, 10);

      data.push({
        date: dateString,
        open: parseFloat(open.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        high: parseFloat(high.toFixed(2))
      });
    }

    return data;
  }

  randomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
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
