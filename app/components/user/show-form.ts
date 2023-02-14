import Component from '@glimmer/component';
import { action } from '@ember/object';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import { inject as service } from '@ember/service';

interface UserShowFormArgs {
  show: ScheduledShow;
}

export default class UserShowForm extends Component<UserShowFormArgs> {
  @service declare router: any;

  file: Blob | null = null;

  weekdays = {
    'Sunday': 'sunday',
    'Monday': 'monday',
    'Tuesday': 'tuesday',
    'Wednesday': 'wednesday',
    'Thursday': 'thursday',
    'Friday': 'friday',
    'Saturday': 'saturday'
  };

  @action updateFile(e: any){
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
  saveShow(event: any) {
    event.preventDefault();
    const show = this.args.show;
    try {
      show.save().then(() => {
        alert('saved the show!');
        this.router.transitionTo('home.show', show);
      });
    } catch (error) {
      alert('could not save show :(');
      console.log(error);
    }
  }

  @action
  setRepeating(event: any) {
    this.args.show.repeating = event.target.value;
    if(this.args.show.repeating) {
      this.args.show.recurringInterval = 'week';
    }
  }

  @action
  setInterval(event: any) {
    this.args.show.recurringInterval = event.target.value;
  }
}
