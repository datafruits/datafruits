import Component from '@glimmer/component';
import { Chart, RadarController, RadialLinearScale, LineElement, PointElement, CategoryScale, Decimation, Filler, Legend, Title, Tooltip } from 'chart.js';
//import Chart from 'chart.js/auto';
import { action } from '@ember/object';

interface FruitsAffinitySignature {
  Args: {
    fruitsAffinity: any;
  };
}

export default class FruitsAffinity extends Component<FruitsAffinitySignature> {
  @action
  didInsert() {
    if(Object.keys(this.args.fruitsAffinity).length) {
      Chart.register(RadarController, RadialLinearScale, LineElement, PointElement, CategoryScale, Decimation, Filler, Legend, Title, Tooltip);
      const canvas = document.getElementById('myChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');

      const data = {
        labels: Object.keys(this.args.fruitsAffinity),
        datasets: [{
          label: "Fruit Affinity",
          data: Object.values(this.args.fruitsAffinity),
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
        }]
      };


      new Chart(ctx as CanvasRenderingContext2D, {
        type: 'radar',
        data: data,
        options: {
          scales: {
            r: {

              pointLabels: {
                backdropColor: 'rgba(240, 199, 208, 0.9)',
                color: 'rgba(33, 27, 28, 0.9)',
                font: {
                  style: 'italic',
                  size: 14
                },
                backdropPadding: 5,
                padding: 10,
                borderRadius: 5
              },
              grid: {
                color: 'rgba(216, 221, 66, 0.5)',
                display: true
              },
              angleLines: {
                display: false
              },
              ticks: {
                display: false
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              // position: 'bottom',
              fullSize: false,
              labels: {
                padding: 15,
                color: 'rgb(255, 249, 79)',
                font: {
                  weight: 'bold',
                  size: 16
                }
              }
            }
          }
        }
      });
    }
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FruitsAffinity: typeof FruitsAffinity;
  };;;;;;;;;;
}

