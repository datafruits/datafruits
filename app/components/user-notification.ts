import Component from '@glimmer/component';
import type Notification from 'datafruits13/models/notification';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime)

interface UserNotificationSignature {
  Args: {
    notification: Notification;
  };
}

export default class UserNotification extends Component<UserNotificationSignature> {
  get formattedDate(): string {
    const timeZone = dayjs.tz.guess();
    return dayjs().to(dayjs(this.args.notification.createdAt).tz(timeZone).format('LLL'));
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UserNotification: typeof UserNotification;
  }
}

