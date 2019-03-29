import ActiveModelAdapter from 'active-model-adapter';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default ActiveModelAdapter.extend(AdapterFetch, {
  host: 'https://datafruits.streampusher.com',
  buildURL: function() {
    var base;
    base = this._super.apply(this, arguments);
    return "" + base + ".json";
  }
});
