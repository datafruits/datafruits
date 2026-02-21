import { BaseService, tracked } from '../../../framework/index.js';

export default class ChatTextService extends BaseService {
  @tracked color = 'color: #fff940';

  setColor(hexCode) {
    this.color = 'color: ' + hexCode;
  }

  constructor() {
    super();
    const storedColor = localStorage.getItem('datafruits-chat-color');
    if (storedColor) {
      this.color = `color: ${storedColor}`;
    }
  }
}
