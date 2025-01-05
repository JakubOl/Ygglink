import { StockData } from "./stock-data";

export interface Stock {
    symbol: string;
    name?: string;
    data?: StockData[];
}