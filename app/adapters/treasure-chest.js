import classic from 'ember-classic-decorator';
import ApplicationAdapter from './application';

@classic
export default class TreasureChest extends ApplicationAdapter {
  // normal class body
  namespace = 'api';

}
