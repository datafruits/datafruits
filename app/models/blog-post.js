import DS from 'ember-data';
import { computed } from '@ember/object'; const { Model } = DS;
import { htmlSafe } from '@ember/template';

export default Model.extend({
  blogPostBodies: DS.hasMany('blog-post-body'),
  body: computed('blogPostBodies.[]', function(){
    return htmlSafe(this.blogPostBodies.firstObject.renderedBody);
  }),
  title: computed('blogPostBodies.[]', function(){
    return this.blogPostBodies.firstObject.title;
  }),
  publishedAt: DS.attr()
});
