import Route from '@ember/routing/route';

export default class DjsRoute extends Route {
  async model(params) {
    // params.page = params.page || 1;
    // return this.store.query('dj', {
    //   page: params.page,
    //   search: {
    //     keyword: params.query,
    //   },
    // });
  }
}
