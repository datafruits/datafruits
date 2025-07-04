import Component from '@glimmer/component';
import { service } from '@ember/service';
//import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { SafeString } from 'handlebars';
import emojione from 'emojione';
import type ShowSeries from 'datafruits13/models/show-series'
import type RouterService from '@ember/routing/router-service';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';
import formatTime from '../../helpers/format-time';
import TrackLabel from '../track-label';
import EpisodeList from './episode-list';

interface ShowSeriesViewArgs {
  showSeries: ShowSeries;
}

export default class ShowSeriesView extends Component<ShowSeriesViewArgs> {
  @service declare session: any;
  @service declare currentUser: any;
  @service declare router: RouterService;

  // @action
  // browseLabel(label) {
  //   this.router.transitionTo('home.podcasts', { queryParams: { tags: label.name } });
  // }

  get description(): SafeString | undefined {
    if(this.args.showSeries.description) {
      return htmlSafe(emojione.shortnameToImage(this.args.showSeries.description));
    } else {
      return undefined;
    }
  }

  get canEdit(): boolean {
    return this.args.showSeries.users.includes(this.currentUser.user) || this.currentUser.user.roles.includes('admin');
  }

  <template>
    <div class="relative show-poster w-full flex space-x-2">
      <div class="w-1/2">
        <div style="background-image: url({{@showSeries.imageUrl}})" alt={{@showSeries.title}} class="w-full h-full show-image bg-top bg-cover"></div>
        <div class="show-info">
          {{#if this.canEdit}}
            <div class="my-2">
              <LinkTo
                @route="home.user.my-shows.edit"
                @model={{@showSeries.slug}}
                class="cool-button absolute top-0 right-0"
              >
                EDIT
              </LinkTo>
            </div>
          {{/if}}
          <h1 class="font-cursive text-3xl">
            {{@showSeries.title}}
          </h1>
          {{#if @showSeries.repeating}}
            <h2 class="text-xl uppercase">
              {{@showSeries.formattedRecurringInterval}}
            </h2>
          {{/if}}
          {{#if @showSeries.users.length}}
            <h2>
              {{t "show.hosted_prefix"}}
              {{#each @showSeries.users as |host|}}
                <div>
                  <img
                    class="inline rounded-lg"
                    style="height: 2rem;"
                    src="{{host.avatarUrl}}"
                    align="center"
                    alt={{host.username}} / >
                </div>
                <span class="font-cursive text-xl">
                  <LinkTo @route="home.dj" @model={{host.username}}>
                    {{host.username}}
                  </LinkTo>
                </span>
              {{/each}}
            </h2>
          {{/if}}
          {{#if @showSeries.repeating}}
            <h3 class="modal-title uppercase" id="myModalLabel">
              Every {{@showSeries.formattedCadence}} at {{formatTime @showSeries.startTime}}
            </h3>
          {{/if}}
          <p>
            {{this.description}}
          </p>
        </div>
        <div class="p-2">
          {{#each @showSeries.labels as |label|}}
            <TrackLabel @label={{label}} />
          {{/each}}
        </div>
      </div>
      <div class="w-1/2 p-2">
        <h1 class="text-2xl">
          {{t "show.episodes"}}
        </h1>
        <EpisodeList
          @showSeries={{@showSeries}}
          @page={{this.router.currentRoute.queryParams.page}}
        />
      </div>
    </div>
  </template>
}
