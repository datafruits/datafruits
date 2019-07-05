import DS from 'ember-data';

export default DS.Model.extend({
  dj: DS.belongsTo('dj'),
  url: DS.attr()
});
