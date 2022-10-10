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
    Chart.register(RadarController, RadialLinearScale, LineElement, PointElement, CategoryScale, Decimation, Filler, Legend, Title, Tooltip);

    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    console.log('this.args.fruitsAffinity.keys', this.args.fruitsAffinity.keys);
    console.log('this.args.fruitsAffinity.values', this.args.fruitsAffinity.values);

    const data = {
      labels: this.args.fruitsAffinity.keys,
      datasets: [{
        label: "This user's Fruit Affinity",
        data: this.args.fruitsAffinity.values,
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
        elements: {
          line: {
            borderWidth: 3
          }
        }
      }
    });
  }
}
