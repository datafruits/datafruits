/* eslint-disable ember/no-mixins */
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import FastbootAdapter from 'ember-data-storefront/mixins/fastboot-adapter';
import ENV from 'datafruits13/config/environment';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import classic from 'ember-classic-decorator';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';

@classic
export default class Application extends JSONAPIAdapter.extend(FastbootAdapter) {
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

  pathForType(type) {
    var underscored = underscore(type);
    return pluralize(underscored);
  }
}
