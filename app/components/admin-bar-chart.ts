import Component from '@glimmer/component';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { action } from '@ember/object';

interface AdminBarChartSignature {
  Args: {
    chartId: string;
    data: {
      labels: string[];
      data: number[];
    };
    title: string;
    backgroundColor?: string;
    borderColor?: string;
    suggestedMax: number;
  };
}

export default class AdminBarChart extends Component<AdminBarChartSignature> {
  chart: Chart | null = null;

  @action
  didInsert() {
    // Guard against server-side rendering and check for data
    if (typeof window === 'undefined' || !this.args.data?.labels?.length) {
      return;
    }

    // Register Chart.js components
    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const canvas = document.getElementById(this.args.chartId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: this.args.data.labels,
      datasets: [{
        label: this.args.title,
        data: this.args.data.data,
        backgroundColor: this.args.backgroundColor || 'rgba(75, 192, 192, 0.5)',
        borderColor: this.args.borderColor || 'rgb(75, 192, 192)',
        borderWidth: 1
      }]
    };

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: this.args.title,
            color: '#ffffff'
          },
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: '#444444'
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: this.args.suggestedMax,
            ticks: {
              stepSize: 100000,
              color: '#ffffff'
            },
            grid: {
              color: '#444444'
            }
          }
        }
      }
    });
  }

  @action
  willDestroy() {
    super.willDestroy();
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    AdminBarChart: typeof AdminBarChart;
  }
}
