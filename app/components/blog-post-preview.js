import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default class BlogPostPreview extends Component {
  @service
  intl;

  @computed('intl.locale', 'post.blogPostBodies')
  get body() {
    let body = this.post.blogPostBodies.filter((body) => {
      return body.language == this.intl.locale;
    }).firstObject;
    if (!body) {
      body = this.post.blogPostBodies.filter((body) => {
        return body.language == "en";
      }).firstObject;
    }
    return body;
  }
}
