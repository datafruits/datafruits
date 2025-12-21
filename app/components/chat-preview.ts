import Component from '@glimmer/component';
import { service } from '@ember/service';
import type ChatService from 'datafruits13/services/chat';

interface ChatPreviewArgs {}

export default class ChatPreview extends Component<ChatPreviewArgs> {
  @service declare chat: ChatService;
}
