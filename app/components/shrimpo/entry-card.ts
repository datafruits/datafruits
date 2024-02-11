import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';

interface ShrimpoEntryCardArgs {
  shrimpoEntry: ShrimpoEntry;
}

export default class ShrimpoEntryCard extends Component<ShrimpoEntryCardArgs> {}
