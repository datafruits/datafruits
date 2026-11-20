import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class GiphySearch extends Component {
  @tracked provider = "giphy";
  @tracked query = "";
  @tracked gifType = "gifs";

  @action
  changeProvider(event) {
    this.provider = event.target.value;
    this.gifType = "gifs";
  }

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
