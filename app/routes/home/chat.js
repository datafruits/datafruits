import { service } from "@ember/service";
import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';

export default class ChatRoute extends Route {
  @service store;
  afterModel() {
    this.setHeadTags();
  }

  setHeadTags() {
    const headTags = ENV.headTags;
    this.headTags = Object.values(headTags);
  }
}
