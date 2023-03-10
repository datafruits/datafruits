import Route from '@ember/routing/route';

export default class HomeForum extends Route {
  model() {
    return this.store.findAll('forum-thread');
  }
}
