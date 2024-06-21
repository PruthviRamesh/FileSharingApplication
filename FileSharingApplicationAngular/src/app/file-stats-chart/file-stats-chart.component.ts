import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-file-stats-chart',
  templateUrl: './file-stats-chart.component.html',
  styleUrls: ['./file-stats-chart.component.css']
})
export class FileStatsChartComponent implements OnChanges {
  @Input() chartData: { date: string, totalFiles: number }[] = [];
  @Input() chartTitle: string = '';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: ''
    },
    tooltip: {
      pointFormat: 'Total Files :<b>{point.y}</b>'
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y}'
        }
      }
    },
    series: [{
      type: 'pie',
      name: '',
      data: []
    }] as Highcharts.SeriesOptionsType[]
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      this.updateChartData();
    }
  }

  updateChartData(): void {
    const dataSeries = this.chartData.map(item => ({
      name: item.date, 
      y: item.totalFiles
    }));

    this.chartOptions.series = [{
      type: 'pie',
      name: this.chartTitle,
      data: dataSeries
    }] as Highcharts.SeriesOptionsType[];

    this.chartOptions.title!.text = this.chartTitle; 
  }
}
