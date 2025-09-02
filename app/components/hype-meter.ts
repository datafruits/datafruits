import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type ChatService from 'datafruits13/services/chat';

interface HypeMeterArgs {}

export default class HypeMeter extends Component<HypeMeterArgs> {
  @service declare chat: ChatService;
  get progress() {
    return this.chat.limitBreakProgress;
  }

  get almostReached() {
    return this.chat.limitBreakProgress >= 70;
  }
}
