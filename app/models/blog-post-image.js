import Model, { belongsTo, attr } from '@ember-data/model';

export default Model.extend({
  blogPostBody: belongsTo('blog-post-body'),
  imageFileName: attr(),
  cdnUrl: attr(),
  s3Url: attr()
});
