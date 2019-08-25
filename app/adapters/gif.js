import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  // https://api.giphy.com/v1/gifs/search?api_key=OJAyf3JHblNAu9hHhmccbPrH4wCN0pJQ&q=garfield&limit=25&offset=0&rating=G&lang=en
  host: "https://api.giphy.com",
  urlForQuery(query){
    console.log(`query in gif adapter: ${query}`);
    return `${this.urlPrefix()}/v1/gifs/search?api_key=OJAyf3JHblNAu9hHhmccbPrH4wCN0pJQ&q=${query.term}&limit=25&offset=0&rating=G&lang=en`;
  }
});
