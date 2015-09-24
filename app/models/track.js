import DS from 'ember-data';

export default DS.Model.extend({
  audio_file_name: DS.attr(),
  title: DS.attr(),
  podcast_published_date: DS.attr()
});
