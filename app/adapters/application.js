import ActiveModelAdapter from 'active-model-adapter';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';
import FastbootAdapter from 'ember-data-storefront/mixins/fastboot-adapter';

export default ActiveModelAdapter.extend(AdapterFetch, FastbootAdapter, {
  host: 'https://datafruits.streampusher.com',
  buildURL: function() {
    var base;
    base = this._super.apply(this, arguments);
    return "" + base + ".json";
  }
});
