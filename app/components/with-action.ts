import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

interface WithActionArgs {
  action: any;
}

export default class WithAction extends Component<WithActionArgs> {
  @service declare router: RouterService;

  @action
  addRouterHook() {
    this.router.on('routeWillChange', () => {
      console.log('added routeWillChange hook');
      this.args.action();
    });
  }

  @action
  removeRouterHook() {
    this.router.off('routeWillChange', () => {
      console.log('removed router hook');
    });
  }
}
