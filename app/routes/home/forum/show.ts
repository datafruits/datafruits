import Route from '@ember/routing/route';

export default class HomeForumShow extends Route {
  model(params: any) {
    return this.store.findRecord('forum-thread', params.title);
  }
}
