import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import ENV from 'datafruits13/config/environment';

export default class IndexController extends Controller {
  @service('router') router;
@action
  browseLabel(label) {
    this.router.transitionTo('home.podcasts', { queryParams: { tags: label.name } });
  }

  get latestYoutubeVideoId() {
    // const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${ENV.YOUTUBE_CHANNEL_ID}&maxResults=1&order=date&type=video&key=${ENV.GOOGLE_API_KEY}`;
    // fetch(url).then(res => {
    //   console.log(res);
    // });
    return "h0eJSt8hIBE";
  }
}
