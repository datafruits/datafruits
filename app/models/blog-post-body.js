import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  blogPost: DS.belongsTo('blogPost'),
  title: DS.attr(),
  body: DS.attr(),
  renderedBody: DS.attr()
});
