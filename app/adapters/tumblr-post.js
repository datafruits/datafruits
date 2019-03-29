// adapters/tumblr-post.js
import PostAdapter from 'ember-tumblr/adapters/tumblr-post';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default PostAdapter.extend(AdapterFetch, {
  blogUrl: 'datafruits.tumblr.com',
  apiKey: 'l2LGUWExJu5OIVAei9AYib8smwRwuJ3o8CsHz2aaIznqrioC8w'
});
