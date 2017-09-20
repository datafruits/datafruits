import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: "https://datafruits.streampusher.com",
  buildURL: function() {
    var base;
    base = this._super.apply(this, arguments);
    return "" + base + ".json";
  }
});
