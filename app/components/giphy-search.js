import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class GiphySearch extends Component {
  @tracked gifType = "gifs";

  @action
  focus(element) {
    element.children.namedItem("giphy-search-term").focus();
  }

  @action
  useGifs() {
    this.gifType = "gifs";
  }

  @action
  useStickers() {
    this.gifType = "stickers";
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    GiphySearch: typeof GiphySearch;
  }
}
  
