import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

//interface RandomBannerAdArgs {}

export default class RandomBannerAd extends Component {
  @tracked currentAd: Record<string, string> = { img: "/assets/images/ad-open-space.png", link: "" };

  ads: Record<string, string>[] = [
    { img: "/assets/images/ad-open-space.png", link: "" },
    { img: "/assets/images/ad-burgerzone-thrilling-graphics.png", link: "https://cybertomato.xyz/" },
    { img: "/assets/images/ad-datafruits-archives.png", link: "https://datafruits.fm/podcasts" },
    { img: "/assets/images/ad-datafruits-radio-gotta-be.png.png", link: "" },
    { img: "/assets/images/ad-datafruits-radio-support.png", link: "https://datafruits.fm/support" },
    { img: "/assets/images/ad-datafruits-strawbur.png", link: "" },
    { img: "/assets/images/ad-monday-nite-fruits.png", link: "" },
  ]

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.randomBanner();
  }

  randomBanner() {
    const random = Math.floor(Math.random() * this.ads.length);
    this.currentAd = this.ads[random];
    console.log('currentAd: ', this.currentAd);
    later(() => {
      this.randomBanner();
    }, 5_000);
  }
}
