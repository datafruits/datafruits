import ActiveModelAdapter from 'active-model-adapter';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';
import CachedShoe   from 'ember-cached-shoe'

export default ActiveModelAdapter.extend(AdapterFetch, CachedShoe, {
  host: 'https://datafruits.streampusher.com',
  buildURL: function() {
    var base;
    base = this._super.apply(this, arguments);
    return "" + base + ".json";
  }
});
