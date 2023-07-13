import Component from '@glimmer/component';
import { action } from '@ember/object';
import { BufferedChangeset } from 'ember-changeset/types';
import { tracked } from '@glimmer/tracking';
import dayjs, { Dayjs } from "dayjs";

interface TimePickerArgs {
  changeset: BufferedChangeset;
  value: Dayjs;
  property: string;
  onChange?: (val: Dayjs) => void;
}

export default class TimePickerComponent extends Component<TimePickerArgs> {
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

  @tracked selected: string = '20:00';

  @action
  setTime(value: string) {
    const hours = value.split(':')[0];
    const minutes = value.split(':')[1];
    const oldDate = this.args.value;
    let newDate = dayjs((oldDate as any).content); //sorry musta been the onion salad dressing

    newDate = newDate.hour(parseInt(hours)).minute(parseInt(minutes));
    this.selected = value;
    const property = this.args.property;
    this.args.changeset.set(property, newDate.toISOString());
    this.args.changeset.validate(property);
    if(this.args.onChange) {
      this.args.onChange(newDate);
    }
  }

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.selected = `${this.args.value.format("HH")}:00`;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TimePickerComponent: typeof TimePickerComponent;
  }
}
