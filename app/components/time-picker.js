import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TimePickerComponent extends Component {
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

  get selected() {
    const time = this.args.value;
    if (time) {
      return `${time.getHours()}:00`;
    } else {
      return '00:00';
    }
  }

  @action
  setTime(value) {
    //const property = this.args.property;
    let hours = value.split(':')[0];
    let minutes = value.split(':')[1];
    const oldDate = this.args.value;
    // if(oldDate) {
    // } else {
    // }
    let newDate = new Date(
      oldDate.getFullYear(),
      oldDate.getMonth(),
      oldDate.getDate(),
      hours,
      minutes
    );
    this.args.onChange(newDate);
    // this.args.changeset.set(property, newDate);
    // this.args.changeset.validate(property);
  }
}
