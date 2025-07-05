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
dayjs.extend(relativeTime);

interface UserNotificationSignature {
  Args: {
    notification: Notification;
  };
}

export default class UserNotification extends Component<UserNotificationSignature> {<template><li class="bg-df-pink text-2xl rounded-lg p-2 mb-2 block hover:bg-df-green flex justify-between">
  {{#if @notification.url}}
    <a href="{{@notification.url}}">
      <h2 class="mr-4">{{@notification.message}}</h2>
    </a>
  {{else}}
    <h2 class="mr-4">{{@notification.message}}</h2>
  {{/if}}
  <span class="text-base">{{this.formattedDate}}</span>
</li></template>
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

