import ApplicationAdapter from './application';

export default class GiftSubscription extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/gift_subscriptions`;
  }
}
