import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import ShowSeriesValidations from '../../validations/show-series';
import type ShowSeries from 'datafruits13/models/show-series';
import type User from 'datafruits13/models/user';
import dayjs, { Dayjs } from "dayjs";
import { BufferedChangeset } from 'ember-changeset/types';
import changeset from "ember-changeset/helpers/changeset";
import ChangesetForm from "../ui/changeset-form.ts";
import t from "ember-intl/helpers/t";
import PowerSelectMultiple from "ember-power-select/components/power-select-multiple";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import not from "ember-truth-helpers/helpers/not";
import formatDay from "../../helpers/format-day.js";
import TimePicker from "../time-picker.gts";
import notEq from "ember-truth-helpers/helpers/not-equal";
import eq from "ember-truth-helpers/helpers/equal";
import pick from "ember-composable-helpers/helpers/pick";
import set from "ember-set-helper/helpers/set";
import WeekdaySelect from "./show-form/weekday-select.ts";
import LabelsSelect from "../labels-select.gts";
import and from "ember-truth-helpers/helpers/and";
import includes from "ember-composable-helpers/helpers/includes";
import Button from "@frontile/buttons/components/button";
import or from "ember-truth-helpers/helpers/or";

interface UserShowFormArgs {
  show: ShowSeries;
}

export default class UserShowForm extends Component<UserShowFormArgs> {<template>{{#let (changeset @show this.ShowSeriesValidations) as |changeset|}}
  <ChangesetForm class="max-w-md" @changeset={{changeset}} @onError={{this.onError}} @onSubmit={{this.onSubmit}} as |Form|>
      {{#each-in this.errors as |field error|}}
        <div class="error">
          {{field}}: {{error}}
        </div>
      {{/each-in}}
      <Form.Input @label={{t "profile.my-shows.form.title"}} @fieldName="title" @containerClass="mb-2" />
        <h4 class="block text-sm font-bold mb-2">Host</h4>
        <PowerSelectMultiple @renderInPlace={{true}} @searchEnabled={{true}} @search={{this.searchDjs}} @options={{@users}} @selected={{changeset.users}} @onChange={{fn (mut changeset.users)}} as |dj|>
          {{dj.username}}
        </PowerSelectMultiple>
      <div>
        <label class="align-top" for="show-artwork"> {{t "profile.my-shows.form.artwork"}}</label>
        <br />
        {{#if @show.isNew}}
          {{#if changeset.image}}
            <img alt="artwork" width="300" height="300" src={{changeset.image}}>
          {{/if}}
        {{else}}
          {{#if changeset.thumbImageUrl}}
            <img alt="artwork" width="300" height="300" src={{changeset.thumbImageUrl}}>
          {{/if}}
        {{/if}}
        <input class="py-4 px-4 my-2 text-df-yellow w-full semibold border-dashed" id="showArtwork" name="showArtwork" type="file" {{on "change" this.updateFile}} />
      </div>
      <Form.Textarea @label={{t "profile.my-shows.form.description"}} @fieldName="description" @containerClass="mb-2" @size="lg" @value={{changeset.description}} rows="20" cols="50" />
      <div>
        <label class="block text-sm font-bold mb-2" for="body">{{t "profile.my-shows.form.start"}}</label>
        <div class="flex">
          {{#if (not @edit)}}
            <input class="mr-2" type="date" id="start-date" min={{this.currentDate}} value={{formatDay changeset.startDate}} {{on "change" (fn this.adjustRecurringForDate changeset)}} />
          {{/if}}
          <TimePicker @property="startTime" @changeset={{changeset}} @onChange={{this.setEndAfterStart}} />
          <TimePicker @property="endTime" @changeset={{changeset}} @startTime={{changeset.startTime}} />
        </div>
      </div>
      <div class="mb-2">
        <label class="block text-sm font-bold mb-2" for="repeating">{{t "profile.my-shows.form.repeating"}}</label>
        <select id="repeating" {{on "change" (fn this.setRepeating changeset)}}>
          <option value="true" selected={{notEq changeset.recurringInterval "not_recurring"}}>
            Repeating
          </option>
          <option value="false" selected={{eq changeset.recurringInterval "not_recurring"}}>
            One-off
          </option>
        </select>
      </div>
      {{#if (notEq changeset.recurringInterval "not_recurring")}}
        <div class="mb-2">
          <select id="repeating-interval" {{on "change" (pick "target.value" (set changeset "recurringInterval"))}}>
            <option value="week" selected={{eq changeset.recurringInterval "week"}}>Weekly</option>
            <option value="biweek" selected={{eq changeset.recurringInterval "biweek"}}>Bi-weekly (every other week)</option>
            <option value="month" selected={{eq changeset.recurringInterval "month"}}>Monthly</option>
            <option value="year" selected={{eq changeset.recurringInterval "year"}}>Anuually</option>
          </select>
          {{#if (eq changeset.recurringInterval "week")}}
            <span>On</span>
            <WeekdaySelect @changeset={{changeset}} />
          {{/if}}
          {{#if (eq changeset.recurringInterval "biweek")}}
            <span>On</span>
            <WeekdaySelect @changeset={{changeset}} />
          {{/if}}
          {{#if (eq changeset.recurringInterval "month")}}
            <span>Every</span>
            <select id="monthly-interval" {{on "change" (pick "target.value" (set changeset "recurringCadence"))}}>
              {{#each this.weekdayCadences as |cadence|}}
                <option value={{cadence}} selected={{eq changeset.recurringCadence cadence}}>
                  {{cadence}}
                </option>
              {{/each}}
            </select>
            <WeekdaySelect @changeset={{changeset}} />
          {{/if}}
        </div>
      {{/if}}
      <LabelsSelect class="mb-2" @changeset={{changeset}} />
      {{#if (and (notEq changeset.recurringInterval "not_recurring") (includes "admin" this.currentUser.user.roles))}}
        <select class="mb-4" {{on "change" (pick "target.value" (set changeset "status"))}}>
          {{#each this.statusOptions as |status|}}
            <option value={{status}} selected={{eq changeset.status status}}>
              {{status}}
            </option>
          {{/each}}
        </select>
      {{/if}}
      <div class="mb-2">
        <Button @type="submit" @intent="primary" disabled={{(or Form.state.hasSubmitted changeset.isInvalid)}} class="cool-button mb-2">
          SAVE SHOW
        </Button>
        {{#if Form.state.hasSubmitted}}
          <marquee>{{t "forms.saving"}}</marquee>
        {{/if}}
      </div>
  </ChangesetForm>
{{/let}}</template>
  ShowSeriesValidations = ShowSeriesValidations;

  @service declare router: any;
  @service declare store: any;
  @service declare currentUser: any;

  file: Blob | null = null;

  @tracked users: User[] = [];
  @tracked errors: { [key: string]: string[] } = {};

  weekdayCadences = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Last'
  ];

  statusOptions = [
    'active',
    'archived',
    'disabled'
  ];

  @action
  updateFile(e: any){
    this.file = e.target.files[0];
    this.args.show.imageFilename = e.target.files[0].name;
    const reader = new FileReader();

    reader.onload = (e) => {
      this.args.show.image = e.target?.result as string;
    };
    reader.onerror = (e) => {
      console.log('error reading file');
      console.log(e);
    };

    reader.readAsDataURL(this.file as Blob);
  }

  @action
  setRepeating(changeset: BufferedChangeset, event: any) {
    if(event.target.value === 'true') {
      if(changeset.recurringInterval === 'not_recurring') {
        changeset.set('recurringInterval', 'week');
      }
    } else {
      changeset.set('recurringInterval', 'not_recurring');
    }
  }

  @action
  onSubmit(result: any) {
    this.router.transitionTo('home.show', result);
  }

  @action
  onError(errors: [{ [key: string]: string[] }]) {
    window.alert("Couldn't save show, check the form for errors");
    console.log('couldnt ssave show');
    console.log(errors);
    console.log(errors[0]);
    this.errors = errors[0];
  }

  @action
  setEndAfterStart(startTime: Dayjs, changeset: BufferedChangeset) {
    if(startTime.hour() > dayjs(changeset.get('endTime')).hour()) {
      console.log('setting end time to: ', startTime.add(1, 'hour').hour());
      changeset.set('endTime', startTime.add(1, 'hour'));
    }
  }

  @action
  adjustRecurringForDate(changeset: BufferedChangeset, event: any) {
    const date = new Date(event.target.value.split("-").join(","));
    if(changeset.recurringInterval !== 'not_recurring') {
      const weekday = date.getDay();
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      changeset.set('recurringWeekday', weekdays[weekday]);
      if (changeset.recurringInterval === 'month') {
        const cadence = this._getWeekdayCadenceInMonth(date);
        changeset.set('recurringCadence', cadence);
      }
    }
    changeset.set('startDate', date);
  }

  _getWeekdayCadenceInMonth(date: Date): string {
    const dayOfMonth: number = date.getDate();

    const dayOfWeek: number = date.getDay();

    const firstDay: number = dayOfMonth - dayOfWeek;

    const position: number = Math.floor(firstDay / 7) + 1;

    let label: string;

    if (position === 1) {
      label = 'First';
    } else if (position === 2) {
      label = 'Second';
    } else if (position === 3) {
      label = 'Third';
    } else if (position === 4 || (position === 5 && dayOfMonth + 7 > new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate())) {
      label = 'Last';
    } else {
      label = 'Fourth';
    }

    return label;
  }

  @action
  searchDjs(term: string) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      debounce(this, this._performDjsSearch, term, resolve, reject, 600);
    });
  }

  _performDjsSearch(term: string, resolve: any, reject: any) {
    this.store
      .query('user', {
        search: {
          keyword: term,
        },
      })
      .then((users: any) => {
        this.users = users;
        return resolve(users);
      }, reject);
  }

  get currentDate() {
    return (new Date()).toISOString().split("T")[0];
  }
}
