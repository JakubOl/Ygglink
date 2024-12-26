import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { StockData } from '../../models/stock-data';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss'],
  standalone: false
})
export class StockChartComponent implements OnInit, OnChanges {
  @Input() stockSymbol: string = '';
  @Input() data: StockData[] = [];

  chartOptions: any;

  constructor() { }

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['stockSymbol']) {
      this.initializeChart();
    }
  }

  initializeChart(): void {
    this.chartOptions = {
      title: {
        text: `${this.stockSymbol} Stock Price`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        type: 'category',
        data: this.data.map(d => d.date),
        boundaryGap: true,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      },
      yAxis: {
        scale: true,
        splitArea: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 50,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          top: '90%',
          start: 50,
          end: 100
        }
      ],
      series: [
        {
          name: `${this.stockSymbol} Price`,
          type: 'candlestick',
          data: this.data.map(d => [d.open, d.close, d.low, d.high]),
          itemStyle: {
            color: '#ec0000',
            color0: '#00da3c',
            borderColor: '#8A0000',
            borderColor0: '#008F28'
          }
        }
      ]
    };
  }
}
