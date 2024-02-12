import { action } from "@ember/object";
import Component from "@glimmer/component";
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import { tracked } from "@glimmer/tracking";


export default class DjsSearch extends Component {
  @service
  router;

  badges = [
    { id: 1, name: "dj", img: "/assets/images/badges/dj.webp" },
    { id: 2, name: "vj", img: "/assets/images/badges/vj.webp" },
    { id: 3, name: "strawberry", img: "/assets/images/badges/strawberry.webp" },
    { id: 4, name: "orange", img: "/assets/images/badges/orange.webp" },
    { id: 5, name: "lemon", img: "/assets/images/badges/lemon.webp" },
    { id: 6, name: "supporter", img: "/assets/images/badges/supporter.webp" },
    { id: 7, name: "gold_supporter", img: "/assets/images/badges/gold_supporter.webp" },
    { id: 8, name: "emerald_supporter", img: "/assets/images/badges/emerald_supporter.webp" }
  ];

  get selectedBadges() {
    const queryParams = this.router.currentRoute.queryParams;
    if (queryParams.tags) {
      return queryParams.tags.split(",").map((q) => {
        return this.badges.find((b) => { return b.name === q });
      });
    } else {
      return [];
    }
  }

  @action
  changeBadges(badges) {
    const tags = badges.map(b => b.name);
    console.log(tags);
    const queryParams = { tags: tags, query: this.router.currentRoute.queryParams.query };
    this.router.transitionTo({ queryParams: queryParams });
  }
}
