import Component from '@glimmer/component';
import type Shrimpo from 'datafruits13/models/shrimpo';

interface ShrimpoCardArgs {
  shrimpo: Shrimpo;
}

export default class ShrimpoCard extends Component<ShrimpoCardArgs> {}
