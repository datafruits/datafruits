import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { hasMany, attr } from '@ember-data/model';
import { htmlSafe } from '@ember/template';

@classic
export default class BlogPost extends Model {
  @hasMany('blog-post-body')
  blogPostBodies;

  @computed('blogPostBodies.{[],firstObject.renderedBody}')
  get body() {
    return htmlSafe(this.blogPostBodies.firstObject.renderedBody);
  }

  @computed('blogPostBodies.{[],firstObject.title}')
  get title() {
    return this.blogPostBodies.firstObject.title;
  }

  @attr()
  publishedAt;
}
