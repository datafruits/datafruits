import { Model, belongsTo, attr } from '../../../framework/index.js';

export default class BlogPostImage extends Model {
  @belongsTo('blog-post-body', {
    async: false,
    inverse: null
  })
  blogPostBody;

  @attr()
  imageFileName;

  @attr()
  cdnUrl;

  @attr()
  s3Url;
}
