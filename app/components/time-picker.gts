import Component from '@glimmer/component';
import { action } from '@ember/object';
import { BufferedChangeset } from 'ember-changeset/types';
import dayjs, { Dayjs } from "dayjs";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import PowerSelect from "ember-power-select/components/power-select";
import lengthInHours from "../helpers/length-in-hours.js";

interface TimePickerArgs {
  changeset: BufferedChangeset;
  property: string;
  startTime: string;
  onChange?: (val: Dayjs, changeset: BufferedChangeset) => void;
}

export default class TimePickerComponent extends Component<TimePickerArgs> {<template><div {{didInsert this.setInitialTime}} class="w-32 text-black">
  <PowerSelect @searchEnabled={{true}} @renderInPlace={{true}} @selected={{this.selected}} @onChange={{this.setTime}} @options={{this.availableTimes}} as |time|>
    {{time}}
    {{#if @startTime}}
      {{lengthInHours @startTime time}} hours
    {{/if}}
  </PowerSelect>
</div></template>
  times = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  get availableTimes() {
    let times;
    if(this.args.property === 'endTime' &&
       this.args.changeset.get('startTime')) {
      const startTime = dayjs(this.args.changeset.get('startTime')).format('HH');
      times = this.times.filter((time) => {
        return parseInt(time.split(':')[0]) > parseInt(startTime.split(':')[0]);
      });
    } else {
      times = this.times;
    }
    return times;
  }

  get selected() {
    const property = this.args.property;
    const changeset = this.args.changeset;
    let time;
    // sometimes changeset.get returns a proxy
    if(changeset.get(property) && changeset.get(property).content) {
      time = dayjs(changeset.get(property).content);
    } else {
      time = dayjs(changeset.get(property));
    }
    return time.format("HH:00");
  }

  @action
  setInitialTime() {
    const property = this.args.property;
    const changeset = this.args.changeset;
    let time;
    // sometimes changeset.get returns a proxy
    if(changeset.get(property) && changeset.get(property).content) {
      time = dayjs(changeset.get(property).content);
    } else {
      time = dayjs(changeset.get(property));
    }
    changeset.set(property, time);
    changeset.validate(property).catch((e) => {
      console.log("couldn't validate changeset: ", e);
    });
  }

  @action
  setTime(value: string) {
    const property = this.args.property;
    const changeset = this.args.changeset;

    const hours = value.split(':')[0];
    const minutes = value.split(':')[1];
    let oldDate;
    if(changeset.get(property) && changeset.get(property).content) {
      oldDate = changeset.get(property).content;
    } else {
      oldDate = changeset[property] as Dayjs;
    }
    let newDate = dayjs(oldDate); //sorry musta been the onion salad dressing

    newDate = newDate.hour(parseInt(hours)).minute(parseInt(minutes));
    changeset.set(property, newDate.toISOString());
    changeset.validate(property).catch((e) => {
      console.log("couldn't validate changeset: ", e);
    });
    if(this.args.onChange) {
      this.args.onChange(newDate, this.args.changeset);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TimePickerComponent: typeof TimePickerComponent;
  }
}
