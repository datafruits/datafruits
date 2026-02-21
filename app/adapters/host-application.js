import { Adapter } from '../../../framework/index.js';

export default class HostApplicationAdapter extends Adapter {
  urlForCreateRecord() {
    return `api/host_applications`;
  }
}
