import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class AudioVisualizer extends Component {
  @action
  didInsert(){
    const myAudio = document.querySelector("audio");
    //myAudio.crossOrigin = "anonymous"

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const freqBarBufferLength = analyser.frequencyBinCount;
    const freqBarDataArray = new Uint8Array(bufferLength);

    const source = audioCtx.createMediaElementSource(myAudio);
    //const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    //analyser.connect(audioCtx.destination);
    source.connect(audioCtx.destination);

    const WIDTH = 4000;
    const HEIGHT = 150;

    const canvas = document.getElementById('visualizer');
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function drawFreqBars(canvasCtx, dataArray, bufferLength) {
      //draw freqBars
      //
      const pink = 'rgb(207, 121, 223)';
      const blue = 'rgb(0, 168, 238)';
      const green = 'rgb(65, 208, 105)';
      const yellow = 'rgb(232, 224, 0)';

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        canvasCtx.fillStyle = blue;
        // if(i % 1 === 0) {
        //   canvasCtx.fillStyle = pink;
        // } else if (i % 2 === 0) {
        //   canvasCtx.fillStyle = blue;
        // } else if (i % 3 === 0) {
        //   canvasCtx.fillStyle = green;
        // } else if (i % 4 === 0) {
        //   canvasCtx.fillStyle = yellow;
        // }
        //canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    function draw() {
      const drawVisual = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      analyser.getByteFrequencyData(freqBarDataArray);

      //console.log(dataArray.toString());

      // canvasCtx.fillStyle = "rgb(200, 200, 200)";
      // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      //draw freqBars
      drawFreqBars(canvasCtx, freqBarDataArray, freqBarBufferLength);

      //draw oscilloscope
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";
      canvasCtx.beginPath();

      const sliceWidth = WIDTH * 1.0 / bufferLength;
      let x = 0;

      let sum = 0;

      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
        const v = dataArray[i] / 128.0;
        //console.log(dataArray[i]);
        //console.log(v)
        const y = v * (HEIGHT / 2);

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }
      let average = sum / bufferLength;
      //console.log("AVERAGE", average);

      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
    }

    draw();
  }
}
