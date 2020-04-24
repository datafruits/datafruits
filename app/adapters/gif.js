import classic from 'ember-classic-decorator';
import JSONAPIAdapter from '@ember-data/adapter/json-api';

@classic
export default class Gif extends JSONAPIAdapter {
  // https://api.giphy.com/v1/gifs/search?api_key=OJAyf3JHblNAu9hHhmccbPrH4wCN0pJQ&q=garfield&limit=25&offset=0&rating=G&lang=en
  host = "https://api.giphy.com";

  urlForQuery(query) {
    return `${this.urlPrefix()}/v1/gifs/search?api_key=OJAyf3JHblNAu9hHhmccbPrH4wCN0pJQ&q=${query.query}&limit=25&offset=0&rating=G&lang=en`;
  }
}
