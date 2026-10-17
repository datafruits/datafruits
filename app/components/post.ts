import Component from '@glimmer/component';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export default class Post extends Component {
  @service('emoji-zone') declare emojiZone: EmojiZoneService;

  get body(): SafeString {
    // @ts-ignore
    const postBody = this.args.post?.body;
    if (!postBody) return htmlSafe('');

    let parsedBody = postBody.replace(/:([a-zA-Z0-9_+-]+):/g, (match: string, name: string) => {
      if (this.emojiZone) {
        let url = this.emojiZone.urlFor(name);
        if (url) {
          return this.emojiZone.htmlFor(name);
        }
      }
      return match;
    });

    return htmlSafe(parsedBody);
  }

  get formattedDate(): string {
    // @ts-ignore
    const createdAt = this.args.post?.createdAt;
    const timeZone = dayjs.tz.guess();
    return dayjs(createdAt).tz(timeZone).format('LLL');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Post: typeof Post;
  }
}