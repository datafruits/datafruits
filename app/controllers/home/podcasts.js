import Controller from '@ember/controller';

export default class PodcastsController extends Controller {
  queryParams = ['query', 'page', 'tags'];
}
