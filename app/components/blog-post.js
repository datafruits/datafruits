import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class BlogPost extends Component {
  @service
  i18n;

  @computed('i18n.locale', 'post.blogPostBodies')
  //@tracked post.blogPostBodies;
  get body() {
    let body = this.post.blogPostBodies.filter( (body) => {
      return body.language == this.i18n.locale;
    }).firstObject;
    if(!body) {
      body = this.post.blogPostBodies.filter( (body) => {
        return body.language == 'en';
      }).firstObject;
    }
    return body;
  }
}
