import Component from '@glimmer/component';
import { action } from '@ember/object';
import EventBusService from 'datafruits13/services/event-bus';
import { inject as service } from '@ember/service';

export default class KeyboardControls extends Component {
  @service declare eventBus: EventBusService;

  @action
  didInsert() {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if(e.key === 's') {
        this.eventBus.publish('fruitTipped', 'strawberry');
      } else if(e.key === 'o') {
        this.eventBus.publish('fruitTipped', 'orange');
      } else if(e.key === 'l') {
        this.eventBus.publish('fruitTipped', 'lemon');
      } else if(e.key === 'b') {
        this.eventBus.publish('fruitTipped', 'banana');
      } else if(e.key === 'c') {
        this.eventBus.publish('fruitTipped', 'cabbage');
      } else if(e.key === 'w') {
        this.eventBus.publish('fruitTipped', 'watermelon');
      }
    });
  }
}
