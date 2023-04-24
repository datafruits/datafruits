import Component from '@glimmer/component';
import type Notification from 'datafruits13/models/notification';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);


interface UserNotificationArgs {
  notification: Notification;
}

export default class UserNotification extends Component<UserNotificationArgs> {
  get formattedDate(): string {
    const timeZone = dayjs.tz.guess();
    return dayjs(this.args.notification.createdAt).tz(timeZone).format('LLL');
  }
}
