import Component from "@ember/component";
import { action } from "@ember/object";

export default class CameraMenu extends Component {
  CameraSensor!: HTMLCanvasElement;

  @action
  willRender(): void {
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
  cameraAction() {
    console.log('camera button clicked');

  }
}