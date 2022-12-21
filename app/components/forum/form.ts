import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';
import { action } from '@ember/object';

interface ForumFormArgs {
  thread: ForumThread
}

export default class ForumForm extends Component<ForumFormArgs> {
  @action submit() {
  }
}
