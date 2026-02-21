import { BaseService, tracked } from '../../../framework/index.js';

export default class HeadDataService extends BaseService {
  @tracked title;
  @tracked image;
  @tracked description;
}
