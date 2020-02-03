import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  i18n: service(),
  body: computed('i18n.locale', function(){
    let body = this.post.blogPostBodies.filter( (body) => {
      return body.language == this.i18n.locale;
    }).firstObject;
    if(!body) {
      body = this.post.blogPostBodies.filter( (body) => {
        return body.language == 'en';
      }).firstObject;
    }
    return body;
  }),
});
