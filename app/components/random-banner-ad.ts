import Component from '@glimmer/component';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';

//interface RandomBannerAdArgs {}

export default class RandomBannerAd extends Component {
  @tracked currentAd: Record<string, string> = { img: "/assets/images/ad-open-space.png", link: "" };

  ads: Record<string, string>[] = [
    { img: "/assets/images/ad-vibeit.webp", link: "https://datafruits.fm/shows/vibe-it-out" },
    { img: "/assets/images/ad-chewing-water.png", link: "https://datafruits.fm/shows/chewing-water-7a8e34ca-ee2a-45f1-864a-eeddd24ca7f4" },
    { img: "/assets/images/ad-open-space.png", link: "" },
    { img: "/assets/images/ad-burgerzone-thrilling-graphics.png", link: "https://cybertomato.xyz/" },
    { img: "/assets/images/ad-datafruits-archives.png", link: "https://datafruits.fm/podcasts" },
    { img: "/assets/images/ad-datafruits-radio-gotta-be.png.png", link: "" },
    { img: "/assets/images/ad-datafruits-radio-support.png", link: "https://datafruits.fm/support" },
    { img: "/assets/images/ad-datafruits-strawbur.png", link: "" },
    { img: "/assets/images/ad-monday-nite-fruits.png", link: "https://datafruits.fm/shows/monday-night-fruits" },
  ]

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.randomBanner();
  }

  randomBanner() {
    const random = Math.floor(Math.random() * this.ads.length);
    this.currentAd = this.ads[random];
    if (ENV.environment === 'test') return;
    later(() => {
      this.randomBanner();
    }, 5_000);
  }
}
