import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

@classic
export default class BlogPostPreview extends Component {
  @service
  i18n;

  @computed('i18n.locale')
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
