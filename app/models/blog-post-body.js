import DS from 'ember-data';
const { Model } = DS;
import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';

export default Model.extend({
  language: DS.attr(),
  blogPost: DS.belongsTo('blogPost'),
  title: DS.attr(),
  body: DS.attr(),
  renderedBody: DS.attr(),
  htmlSafeBody: computed('renderedBody', function() {
    return htmlSafe(this.renderedBody);
  })
});
