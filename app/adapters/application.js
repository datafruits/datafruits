import ActiveModelAdapter from 'active-model-adapter';
import FastbootAdapter from 'ember-data-storefront/mixins/fastboot-adapter';
import ENV from "datafruits13/config/environment";

export default ActiveModelAdapter.extend(FastbootAdapter, {
  host: ENV.API_HOST,
  buildURL: function() {
    var base;
    base = this._super.apply(this, arguments);
    return "" + base + ".json";
  }
});
