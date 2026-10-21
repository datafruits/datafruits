import Component from '@glimmer/component';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

interface PostArgs {
  post?: {
    body?: string;
    createdAt?: string | Date;
  };
}

export default class Post extends Component<{ Args: PostArgs }> {
  get formattedDate(): string {
    const createdAt = this.args.post?.createdAt;
    if (!createdAt) return '';
    const timeZone = dayjs.tz.guess();
    return dayjs(createdAt).tz(timeZone).format('LLL');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Post: typeof Post;
  }
}