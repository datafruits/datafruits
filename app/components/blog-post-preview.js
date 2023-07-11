import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class BlogPostPreview extends Component {
  @service
  intl;

  get body() {
    let body = this.args.post.blogPostBodies.filter((body) => {
      return body.language == this.intl.locale;
    }).firstObject;
    if (!body) {
      body = this.args.post.blogPostBodies.filter((body) => {
        return body.language == 'en';
      }).firstObject;
    }
    return body;
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BlogPostPreview: typeof BlogPostPreview;
  }
}
  
