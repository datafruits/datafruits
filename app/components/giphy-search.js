import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class GiphySearch extends Component {
  @action
  focus(element) {
    element.children.namedItem("giphy-search-term").focus();
  }
}
