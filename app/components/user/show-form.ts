import Component from '@glimmer/component';
import { action } from '@ember/object';
import type ScheduledShow from 'datafruits13/models/scheduled-show';

interface UserShowFormArgs {
  show: ScheduledShow;
}

export default class UserShowForm extends Component<UserShowFormArgs> {
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
  saveShow() {
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
