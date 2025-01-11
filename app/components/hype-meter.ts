import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface HypeMeterArgs {}

export default class HypeMeter extends Component<HypeMeterArgs> {
  @tracked progress = 65;
}
