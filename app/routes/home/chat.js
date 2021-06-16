import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';

export default class ChatRoute extends Route {
  @service session;

  afterModel() {
    this.setHeadTags();
  }

  setHeadTags() {
    const headTags = ENV.headTags;
    this.set('headTags', Object.values(headTags));
  }
}
