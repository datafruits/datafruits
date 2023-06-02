import Component from '@glimmer/component';
import { action } from '@ember/object';
import { BufferedChangeset } from 'ember-changeset/types';
import { tracked } from '@glimmer/tracking';

interface TimePickerArgs {
  changeset: BufferedChangeset;
  value: Date;
  property: string;
  onChange?: (val: Date) => void;
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

  @tracked selected = '20:00';
  // get selected() {
  //   console.log('in selected()');
  //   const time = this.args.changeset.get(this.args.property);
  //   console.log(time);
  //   if (time) {
  //     console.log('time: ');
  //     console.log(`${time.getHours()}:00`);
  //     return `${String(time.getHours()).padStart(2, '0')}:00`;
  //   } else {
  //     return '00:00';
  //   }
  // }
  //
  @action
  setTime(value: string) {
    //const property = this.args.property;
    const hours = value.split(':')[0];
    const minutes = value.split(':')[1];
    const oldDate = this.args.value;
    // if(oldDate) {
    // } else {
    // }
    const newDate = new Date(
      oldDate.getFullYear(),
      oldDate.getMonth(),
      oldDate.getDate(),
      parseInt(hours),
      parseInt(minutes)
    );
    if(this.args.onChange) {
      this.args.onChange(newDate);
    }
    this.selected = value;
    const property = this.args.property;
    // doesnt work?
    this.args.changeset.set(property, newDate);
    this.args.changeset.validate(property);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TimePickerComponent: typeof TimePickerComponent;
  }
}
