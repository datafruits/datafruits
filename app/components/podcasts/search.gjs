import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";
import { Input } from "@ember/component";
import PowerSelectMultiple from "ember-power-select/components/power-select-multiple";

export default class PodcastsSearchComponent extends Component {<template><div id="podcast-search-forms" class="my-4 flex flex-wrap">
  <form role="search" aria-label={{t "podcasts.text_search.label"}} {{on "submit" this.nop}}>
    <div class="md:mx-10 flex flex-col">
      <label class="text-center text-white" for="search-tracks">{{t "podcasts.title_search"}}</label>
      <Input id="search-tracks" name="search-tracks" autofocus="autofocus" @value={{@query}} @escape-press={{this.clearSearch}} {{on "keyup" this.updateQueryAndSearch}} placeholder={{t "podcasts.placeholders.title"}} />
    </div>
  </form>
  <form role="search" class="px-3" aria-label={{t "podcasts.tag_search.label"}}>
    <div class="flex flex-col">
      <label class="text-center text-white" for="tag_search">{{t "podcasts.tag_search"}}</label>
      <PowerSelectMultiple name="tag_search" id="tag_search" @placeholder={{t "podcasts.placeholders.tag"}} @searchEnabled={{true}} @options={{this.labelNames}} @selected={{@selectedLabels}} @renderInPlace={{true}} @onChange={{this.selectLabel}} as |label|>
        {{label}}
      </PowerSelectMultiple>
    </div>
  </form>
</div>
</template>
  @service router;

  @action
  clearSearch() {
    const query = { query: '', tags: this.args.selectedLabels };
    this.router.transitionTo({ queryParams: query });
    //debounce(this, this.args.search, 400);
  }

  @action
  updateQueryAndSearch(event) {
    console.log(event.target.value);
    const query = { query: event.target.value, tags: this.args.selectedLabels };
    this.router.transitionTo({ queryParams: query });
    //debounce(this, this.args.search, 400);
  }

  @action
  nop(event) {
    event.preventDefault();
  }

  @action
  selectLabel(labels) {
    const queryParams = { tags: labels, query: this.router.currentRoute.queryParams.query };
    this.router.transitionTo({ queryParams: queryParams });
    //debounce(this, this.args.search, 400);
  }

  get labelNames() {
    return this.args.labels.map(function (label) {
      return label.get('name');
    });
  }
}
