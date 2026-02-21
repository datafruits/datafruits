import { Adapter } from '../../framework/index.js';

export default class FruitTicketGiftAdapter extends Adapter {
  namespace = 'api';

  urlForCreateRecord() {
    return 'api/fruit_ticket_gifts';
  }
}
