import ApplicationAdapter from './application';

export default class FruitTicketGift extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/fruit_ticket_gifts`;
  }
}
