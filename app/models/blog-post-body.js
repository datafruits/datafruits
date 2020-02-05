import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';

export default Model.extend({
  language: attr(),
  blogPost: belongsTo('blogPost'),
  blogPostImages: hasMany('blog-post-image'),
  title: attr(),
  body: attr(),
  previewImage: computed('blogPostImages.[]', function(){
    if(this.body) {
      return this.blogPostImages.firstObject;
    }else{
      return null;
    }
  }),
  renderedBody: attr(),
  htmlSafeBody: computed('renderedBody', function() {
    return htmlSafe(this.renderedBody);
  })
});
