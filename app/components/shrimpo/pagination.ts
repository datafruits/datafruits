/* eslint-disable-file ember/no-empty-glimmer-component-classes */
import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';

interface ShrimpoPaginationArgs {
  entry: ShrimpoEntry;
}

export default class ShrimpoPagination extends Component<ShrimpoPaginationArgs> {}
