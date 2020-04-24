import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';

@classic
export default class BlogPostBody extends Model {
  @attr()
  language;

  @belongsTo('blogPost')
  blogPost;

  @hasMany('blog-post-image')
  blogPostImages;

  @attr()
  title;

  @attr()
  body;

  @computed('blogPostImages.[]')
  get previewImage() {
    if(this.body) {
      return this.blogPostImages.firstObject;
    }else{
      return null;
    }
  }

  @attr()
  renderedBody;

  @computed('renderedBody')
  get htmlSafeBody() {
    return htmlSafe(this.renderedBody);
  }
}
