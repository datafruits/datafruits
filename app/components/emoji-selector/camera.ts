import Component from "@ember/component";
import { action } from "@ember/object";

export default class CameraMenu extends Component {
  CameraSensor!: HTMLCanvasElement;

  cameraWidth: number = 0; 
  cameraHeight: number = 0;
  
  @action
  willRender() {
    navigator.mediaDevices
      .getUserMedia({  video: { 
        facingMode: "user", 
        width: 360, 
        height: 240 
      }, 
      audio: false 
    }).then(stream => {
      const cameraView = document.querySelector("#camera--view") as HTMLVideoElement;
      cameraView.srcObject = stream;
      cameraView.play();
    })
  }

  @action
  reloadCamera() {
    console.log('retry image');
    const cameraCanvas = document.querySelector("#camera--canvas") as HTMLCanvasElement;
    const cameraView = document.querySelector("#camera--view") as HTMLVideoElement;
    cameraView.attributes.removeNamedItem("width");
    cameraView.attributes.removeNamedItem("height");
    cameraCanvas.getContext("2d")?.clearRect(0, 0, 0, 0);
    cameraCanvas.width = 0;
    cameraCanvas.height = 0;
  }

  @action 
  cameraAction() {
    console.log('camera button clicked');
    // save image here
    const cameraCanvas = document.querySelector("#camera--canvas") as HTMLCanvasElement;
    const cameraView = document.querySelector("#camera--view") as HTMLVideoElement;
    this.cameraWidth = cameraView.width;
    this.cameraHeight = cameraView.height;
    // const cameraOutput = document.querySelector("#camera--output") as HTMLImageElement;
    cameraCanvas.width = cameraView.videoWidth;
    cameraCanvas.height =  cameraView.videoHeight;
    cameraCanvas.getContext("2d")?.drawImage(cameraView, 0, 0)
    cameraView.width = 0;
    cameraView.height = 0;
    // const image = cameraCanvas.toDataURL("image/webp");

    // cameraOutput.src = image;

    // todo upload

  }
}