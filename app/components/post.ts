import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';
import type PostModel from 'datafruits13/models/post';

interface PostArgs {
  post: PostModel;
}

export default class Post extends Component<PostArgs> {
  get body(): SafeString {
    return htmlSafe(emojione.shortnameToImage(this.args.post.body));
  }
}
