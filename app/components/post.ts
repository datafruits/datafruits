import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';
import type PostModel from 'datafruits13/models/post';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

interface PostSignature {
  Args: {
    post: PostModel;
  };
}

export default class Post extends Component<PostSignature> {
  get body(): SafeString {
    return htmlSafe(emojione.shortnameToImage(this.args.post.body));
  }

  get formattedDate(): string {
    const timeZone = dayjs.tz.guess();
    return dayjs(this.args.post.createdAt).tz(timeZone).format('LLL');
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Post: typeof Post;
  }
}
  
