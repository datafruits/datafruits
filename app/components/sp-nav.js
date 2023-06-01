import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SpNav extends Component {
  @service
  session;

  @service
  currentUser;
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SpNav: typeof SpNav;
  }
}
  
