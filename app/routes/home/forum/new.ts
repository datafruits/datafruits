import Route from '@ember/routing/route';

export default class HomeForumNew extends Route {
  model() {
    return this.store.createRecord('forum-thread');
  }
}
