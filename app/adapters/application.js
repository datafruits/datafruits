import ActiveModelAdapter from 'active-model-adapter';
/* eslint-disable ember/no-mixins */
import FastbootAdapter from 'ember-data-storefront/mixins/fastboot-adapter';
import ENV from 'datafruits13/config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class Application extends ActiveModelAdapter.extend(FastbootAdapter) {
  @service session;

  host = ENV.API_HOST;

  @computed('session.{data.authenticated.token,isAuthenticated}')
  get headers() {
    const headers = {};
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.token}`;
    }

    return headers;
  }

  buildURL() {
    var base;
    base = super.buildURL.apply(this, arguments); //eslint-disable-line ember/no-ember-super-in-es-classes
    return '' + base + '.json';
  }
}
