import ApplicationAdapter from './application';

export default class Podcast extends ApplicationAdapter {
  urlForQueryRecord() {
    return `${this.urlPrefix()}/podcasts/datafruits`;
  }
}
