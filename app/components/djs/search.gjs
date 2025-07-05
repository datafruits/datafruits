import { action } from "@ember/object";
import Component from "@glimmer/component";
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import { tracked } from "@glimmer/tracking";
import PowerSelectMultiple from "ember-power-select/components/power-select-multiple";
import DjsSelectedBadge from "./selected-badge.gts";
import t from "ember-intl/helpers/t";


export default class DjsSearch extends Component {<template><PowerSelectMultiple @options={{this.badges}} @selected={{this.selectedBadges}} @selectedItemComponent={{component DjsSelectedBadge}} @allowClear={{true}} @placeholder={{t "djs.filter"}} @onChange={{this.changeBadges}} as |badge|>
  <img class="w-8" src={{badge.img}} />
</PowerSelectMultiple></template>
  @service
  router;

  badges = [
    { id: 1, name: "dj", img: "/assets/images/badges/dj.webp" },
    { id: 2, name: "vj", img: "/assets/images/badges/vj.webp" },
    { id: 3, name: "pineapple", img: "/assets/images/badges/pineapple.webp"},
    { id: 4, name: "strawberry", img: "/assets/images/badges/strawberry.webp" },
    { id: 5, name: "orange", img: "/assets/images/badges/orange.webp" },
    { id: 6, name: "lemon", img: "/assets/images/badges/lemon.webp" },
    { id: 7, name: "banana", img: "/assets/images/badges/banana.webp" },
    { id: 8, name: "watermelon", img: "/assets/images/badges/watermelon.webp" },
    { id: 9, name: "cabbage", img: "/assets/images/badges/cabbage.webp" },
  ];

  get selectedBadges() {
    const queryParams = this.router.currentRoute.queryParams;
    if (queryParams.tags) {
      return queryParams.tags.split(",").map((q) => {
        return this.badges.find((b) => { return b.name === q; });
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
