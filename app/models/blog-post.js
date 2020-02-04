import Model, { hasMany, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default Model.extend({
  blogPostBodies: hasMany('blog-post-body'),
  body: computed('blogPostBodies.[]', function(){
    return htmlSafe(this.blogPostBodies.firstObject.renderedBody);
  }),
  title: computed('blogPostBodies.[]', function(){
    return this.blogPostBodies.firstObject.title;
  }),
  publishedAt: attr()
});
