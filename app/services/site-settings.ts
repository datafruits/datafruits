import { BaseService, tracked } from '../../framework/index.js';

export default class SiteSettings extends BaseService {
  @tracked audioVisualizerOn = false;
}
