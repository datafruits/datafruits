 
import JSONAPIAdapter from '@ember-data/adapter/json-api';
//import FastbootAdapter from 'ember-data-storefront/mixins/fastboot-adapter';
import ENV from 'datafruits13/config/environment';
import { inject as service } from '@ember/service';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';

//export default class Application extends JSONAPIAdapter.extend(FastbootAdapter) {
export default class Application extends JSONAPIAdapter {
  @service session;

  host = ENV.API_HOST;

  get headers() {
    const headers = {};
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.token}`;
    }

    return headers;
  }

  buildURL() {
    var base;
    base = super.buildURL.apply(this, arguments);  
    return '' + base + '.json';
  }

  pathForType(type) {
    var underscored = underscore(type);
    return pluralize(underscored);
  }
}
