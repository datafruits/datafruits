import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class UserBadgeViewerContainer extends Component {
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


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UserBadgeViewerContainer: typeof UserBadgeViewerContainer;
  }
}
  
