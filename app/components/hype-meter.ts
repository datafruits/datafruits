import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type ChatService from 'datafruits13/services/chat';

export default class HypeMeter extends Component<> {
  @service declare chat: ChatService;
  get progress() {
    return this.chat.limitBreakProgress;
  }

  get almostReached() {
    return this.chat.limitBreakProgress >= 70;
  }
}
