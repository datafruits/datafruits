import Component from '@glimmer/component';
import { Chart, RadarController, RadialLinearScale, LineElement, PointElement, CategoryScale, Decimation, Filler, Legend, Title, Tooltip } from 'chart.js';
//import Chart from 'chart.js/auto';
import { action } from '@ember/object';

interface FruitsAffinityArgs {
  fruitsAffinity: any;
}

export default class FruitsAffinity extends Component<FruitsAffinityArgs> {
  @action
  didInsert() {
    if(Object.keys(this.args.fruitsAffinity).length) {
      Chart.register(RadarController, RadialLinearScale, LineElement, PointElement, CategoryScale, Decimation, Filler, Legend, Title, Tooltip);

      const canvas = document.getElementById('myChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      const data = {
        labels: Object.keys(this.args.fruitsAffinity),
        datasets: [{
          label: "This user's Fruit Affinity",
          data: Object.values(this.args.fruitsAffinity),
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
      };


      new Chart(ctx as CanvasRenderingContext2D, {
        type: 'radar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            line: {
              borderWidth: 3
            }
          }
        }
      });
    }
  }
}
