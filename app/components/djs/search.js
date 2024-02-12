import { action } from "@ember/object";
import Component from "@glimmer/component";
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import { tracked } from "@glimmer/tracking";


export default class DjsSearch extends Component {

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

  @tracked
  selectedBadges;


  @service
  router;

  updateQuery() {

    this.tagNames = this.selectedBadges.map(b => b.name);
    const queryParams = { tags: this.tagNames };
    this.router.transitionTo({ queryParams: queryParams });

  }

  @action
  changeBadges(badges) {
    console.log(badges);
    this.selectedBadges = badges
    this.updateQuery();
  }



}
