import Component from '@glimmer/component';
import { action } from '@ember/object';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Await from "./await.js";
import t from "ember-intl/helpers/t";
import currentTimezone from "../helpers/current-timezone.js";
import formatTimetableDay from "../helpers/format-timetable-day.js";
import formatTime from "../helpers/format-time.js";
import isCurrentShow from "../helpers/is-current-show.js";
import { LinkTo } from "@ember/routing";
import { array } from "@ember/helper";
import formatMessageBody from "../helpers/format-message-body.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export default class TimetableCalendarComponent extends Component {<template><Await @promise={{this.fetchShows}}>
  <:pending>
    {{t "timetable.loading"}}
  </:pending>

  <:success as |shows|>
    <table class="page-bg block px-6 py-4">
      <thead>
        <tr>
        <th scope="col" colspan="2">
          {{t "timetable.timezone"}}
          <span class="italic">
            {{currentTimezone}}
          </span>
        </th>
        </tr>
      </thead>
      <tbody>
        {{#each-in this.groupedShows as |day shows|}}
          <tr><td class="text-xl font-debussy">{{formatTimetableDay day}}</td></tr>
          <tr><td><hr /></td></tr>
          {{#each shows as |show|}}
            <tr>
              <td>{{formatTime show.start}} ~ {{formatTime show.end}}</td>
              {{#if (isCurrentShow show)}}
                <td class="bleed">
                  <LinkTo @route="home.shows.episode" @models={{array show.showSeriesSlug show.slug}} title={{show.title}}>
                    {{show.title}}
                  </LinkTo>
                </td>
              {{else}}
                <td>
                  <LinkTo @route="home.shows.episode" @models={{array show.showSeriesSlug show.slug}} title={{show.title}}>
                    {{show.title}}
                  </LinkTo>
                </td>
              {{/if}}
            </tr>
          {{/each}}
          <br />
        {{/each-in}}
      </tbody>
    </table>
  </:success>

  <:error>
    {{t "error"}}{{formatMessageBody ":sorrymustabeentheonionsaladdressing:"}}
  </:error>
</Await></template>
  @service
  store;

  @tracked shows;
  get groupedShows() {
    return this.shows.reduce((accumulator, show) => {
      let date = new Date(show.start);
      //remove time
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      accumulator[date] = accumulator[date] || [];
      accumulator[date].push(show);
      return accumulator;
    }, Object.create(null));
  }

  get fetchShows() {
    const query = {};
    query.timezone = dayjs.tz.guess();
    query.start = dayjs(new Date()).startOf('day').format('YYYY-MM-DD');
    query.end = dayjs(query.start).endOf('month').add(1, 'month').format('YYYY-MM-DD');
    let showsPromise = this.store.query('scheduled-show', query).then((result) => {
      this.shows = result; // eslint-disable-line
    });

    return showsPromise;
  }
}
