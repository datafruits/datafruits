import Component from "@glimmer/component";
import { action } from "@ember/object";
import { formatEmojiHtml } from "datafruits13/helpers/format-emoji-html";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { on } from "@ember/modifier";

interface CameraMenuArgs {
  closeDialog: any;
  sendPhoto: any;
}

export default class CameraMenu extends Component<CameraMenuArgs> {<template><div {{didInsert this.didInsert}} class="border-solid border-4 border-df-green">
  <div class="absolute flex justify-end">
    <button id="camera--trigger" class="cool-button z-10 opacity-40 hover:opacity-100" {{on "click" this.cameraAction}}>
      {{this.cameraEmoji}}
    </button>
    <button id="camera--retry" class="cool-button z-10 opacity-40 hover:opacity-100" {{on "click" this.reloadCamera}}>
      {{this.xMarkEmoji}}
    </button>
    <button id="camera--send" class="cool-button z-10 opacity-40 hover:opacity-100" {{on "click" this.sendCamera}}>
      {{this.checkMarkEmoji}}
    </button>
  </div>
  <canvas id="camera--canvas" width="0" height="0"></canvas>
  <video id="camera--view" autoplay playsinline></video>
</div></template>
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
        cameraView.play().catch((e) => {
          console.error("couldn't play camera stream", e);
        });
      })
      .catch((e) => {
        console.log("couldn't getUserMedia: ", e);
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
