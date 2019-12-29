import DS from 'ember-data';
const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend({
  // https://api.giphy.com/v1/gifs/search?api_key=OJAyf3JHblNAu9hHhmccbPrH4wCN0pJQ&q=garfield&limit=25&offset=0&rating=G&lang=en
  host: "https://api.giphy.com",
  urlForQuery(query){
    return `${this.urlPrefix()}/v1/gifs/search?api_key=OJAyf3JHblNAu9hHhmccbPrH4wCN0pJQ&q=${query.query}&limit=25&offset=0&rating=G&lang=en`;
  }
});
