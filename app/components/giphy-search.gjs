import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import t from "ember-intl/helpers/t";
import { Input } from "@ember/component";
import eq from "ember-truth-helpers/helpers/equal";
import { on } from "@ember/modifier";
import GiphyLoader from "./giphy-loader.js";
import GifPreview from "./gif-preview.ts";

export default class GiphySearch extends Component {<template><div class="mb-2" {{didInsert this.focus}}>
  <label for="giphy-search-term">
    {{t "chat.label.search"}}
  </label>
  <Input class="w-full" @type="text" id="giphy-search-term" name="giphy-search-term" placeholder={{t "chat.search"}} autocomplete="off" @value={{this.query}} />
  <div>
    <input type="radio" id="gifs" value="gifs" name="gif-type" {{on "click" this.useGifs}} checked={{eq this.gifType "gifs"}} />
    <label for="gifs">{{t "chat.gifs"}}</label>
    <input type="radio" id="stickers" value="stickers" name="gif-type" {{on "click" this.useStickers}} checked={{eq this.gifType "stickers"}} />
    <label for="stickers">{{t "chat.stickers"}}</label>
  </div>
</div>
<GiphyLoader @query={{this.query}} @gifType={{this.gifType}} as |loader|>
  {{#if loader.isRunning}}
    <p>{{t "loading"}}</p>
  {{else}}
    {{#each loader.data as |gif|}}
      <GifPreview @gif={{gif}} @sendGif={{@sendGif}} />
    {{/each}}
  {{/if}}
</GiphyLoader>
</template>
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
