import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { on } from "@ember/modifier";
import BadgeViewer from "./badge-viewer.gjs";

export default class UserBadgeViewerContainer extends Component {<template><button class="cursor-pointer" type="button" {{on "click" this.showBadge}}>
  <img class="inline rounded-lg" style="height: 2rem;" src="{{@badge.url}}" align="center" alt={{@badge.description}} title={{@badge.description}}>
</button>
{{#if this.badgeViewerOpen}}
  <BadgeViewer @badge={{@badge}} @toggleModal={{this.closeBadgeViewer}} />
{{/if}}
</template>
  @tracked badgeViewerOpen = false;

  @action
  showBadge() {
    this.badgeViewerOpen = true;
  }

  @action
  closeBadgeViewer() {
    this.badgeViewerOpen = false;
  }
}
