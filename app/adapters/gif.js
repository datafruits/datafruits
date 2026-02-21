import { Adapter } from '../../framework/index.js';

export default class GifAdapter extends Adapter {
  urlForQuery(query) {
    return `https://api.giphy.com/v1/gifs/search?api_key=OJAyf3JHblNAu9hHhmccbPrH4wCN0pJQ&q=${query.query}&limit=25&offset=0&rating=G&lang=en`;
  }
}
