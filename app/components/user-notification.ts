import Component from '@glimmer/component';
import type Notification from 'datafruits13/models/notification';

interface UserNotificationArgs {
  notification: Notification;
}

export default class UserNotification extends Component<UserNotificationArgs> {}
