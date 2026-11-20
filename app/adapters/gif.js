import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'datafruits13/config/environment';

export default class Gif extends JSONAPIAdapter {
  // https://api.giphy.com/v1/gifs/search?api_key=OJAyf3JHblNAu9hHhmccbPrH4wCN0pJQ&q=garfield&limit=25&offset=0&rating=G&lang=en
  host = 'https://api.giphy.com';

  urlForQuery(query) {
    if (query.provider === 'gifcities') {
      return `${ENV.GIFCITIES_HOST.replace(/\/$/, '')}/search?q=${encodeURIComponent(query.query)}`;
    }
    return `${this.urlPrefix()}/v1/gifs/search?api_key=OJAyf3JHblNAu9hHhmccbPrH4wCN0pJQ&q=${
      encodeURIComponent(query.query)
    }&limit=25&offset=0&rating=G&lang=en`;
  }
}
