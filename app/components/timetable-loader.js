import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import moment from 'moment';
import jstz from 'jstimezonedetect';

export default Component.extend({
  store: service(),
  fastboot: service(),
  tagName: '',
  init() {
    this._super(...arguments);
    this.data = [];
  },

  didReceiveAttrs() {
    let query = this.query;
    this.fetchData.perform(query);
  },
});
