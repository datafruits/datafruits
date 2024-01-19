import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class HeadDataService extends Service {
  @tracked title;
  @tracked image;
  @tracked description;
}
