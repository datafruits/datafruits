import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';

interface ForumThreadCardArgs {
  thread: ForumThread;
}

export default class ForumThreadCard extends Component<ForumThreadCardArgs> {}
