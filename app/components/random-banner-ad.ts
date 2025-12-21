import Component from '@glimmer/component';
import { later } from '@ember/runloop';

interface RandomBannerAdArgs {}

export default class RandomBannerAd extends Component<RandomBannerAdArgs> {
  @tracked currentAd: Record<string, string>;

  ads = [
    { img: "/assets/images/ad-open-space.png", link: "" },
    { img: "/assets/images/ad-burgerzone-thrilling-graphics.png", link: "https://cybertomato.xyz/" },
    { img: "/assets/images/ad-datafruits-archives.png", link: "" },
    { img: "/assets/images/ad-datafruits-radio-gotta-be.png.png", link: "" },
    { img: "/assets/images/ad-datafruits-radio-support.png", link: "" },
    { img: "/assets/images/ad-datafruits-strawbur.png", link: "" },
    { img: "/assets/images/ad-monday-nite-fruits.png", link: "" },
  ]

  constructor() {
    this.randomBanner();
  }

  randomBanner() {
    const random = Math.random * ads.length;
    this.current = ads[random];
    later(() => {
      this.randomBanner();
    }, 30_000);
  }
}
