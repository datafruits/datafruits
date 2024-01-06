import Component from "@glimmer/component";
import { action } from "@ember/object";
import { formatEmojiHtml } from "datafruits13/helpers/format-emoji-html";

interface CameraMenuArgs {
  closeDialog: any;
  sendPhoto: any;
}

export default class CameraMenu extends Component<CameraMenuArgs> {
  get cameraEmoji() {
    return formatEmojiHtml(":camera:");
  }
  get checkMarkEmoji() {
    return formatEmojiHtml(":heavy_check_mark:");
  }
  get xMarkEmoji() {
    return formatEmojiHtml(":heavy_multiplication_x:");
  }
  @action
  didInsert() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          width: 360,
          height: 240,
        },
        audio: false,
      })
      .then((stream) => {
        const cameraView = document.querySelector(
          "#camera--view",
        ) as HTMLVideoElement;
        cameraView.srcObject = stream;
        cameraView.play();
      });
  }

  @action
  reloadCamera() {
    const cameraCanvas = document.querySelector(
      "#camera--canvas",
    ) as HTMLCanvasElement;
    const cameraView = document.querySelector(
      "#camera--view",
    ) as HTMLVideoElement;
    cameraView.attributes.removeNamedItem("width");
    cameraView.attributes.removeNamedItem("height");
    cameraCanvas.getContext("2d")?.clearRect(0, 0, 0, 0);
    cameraCanvas.width = 0;
    cameraCanvas.height = 0;
  }

  @action
  sendCamera() {
    const cameraCanvas = document.querySelector(
      "#camera--canvas",
    ) as HTMLCanvasElement;
    const image = cameraCanvas.toDataURL("image/webp");
    this.args.sendPhoto({ url: image });
    this.args.closeDialog();
  }

  @action
  cameraAction() {
    const cameraCanvas = document.querySelector(
      "#camera--canvas",
    ) as HTMLCanvasElement;
    const cameraView = document.querySelector(
      "#camera--view",
    ) as HTMLVideoElement;
    cameraCanvas.width = cameraView.videoWidth;
    cameraCanvas.height = cameraView.videoHeight;
    cameraCanvas.getContext("2d")?.drawImage(cameraView, 0, 0);
    cameraView.width = 0;
    cameraView.height = 0;
  }
}
