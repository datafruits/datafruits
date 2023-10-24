import ApplicationAdapter from './application';
import classic from 'ember-classic-decorator';

@classic
export default class FruitTicketGift extends ApplicationAdapter {
  namespace = 'api';

  urlForCreateRecord() {
    return `${this.urlPrefix()}/fruit_ticket_gifts`;
  }
}
