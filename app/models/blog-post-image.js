import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  blogPostBody: DS.belongsTo('blog-post-body'),
  imageFileName: DS.attr(),
  cdnUrl: DS.attr(),
  s3Url: DS.attr()
});
