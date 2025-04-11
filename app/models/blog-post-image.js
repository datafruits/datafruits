import Model, { belongsTo, attr } from '@ember-data/model';

export default class BlogPostImage extends Model {
  @belongsTo('blog-post-body')
  blogPostBody;

  @attr()
  imageFileName;

  @attr()
  cdnUrl;

  @attr()
  s3Url;
}
