import Component from '@glimmer/component';
import { action } from '@ember/object';
import type ShowSeries from 'datafruits13/models/show-series';
import { inject as service } from '@ember/service';
import ShowSeriesValidations from '../../validations/show-series';

interface UserShowFormArgs {
  show: ShowSeries;
}

export default class UserShowForm extends Component<UserShowFormArgs> {
  ShowSeriesValidations = ShowSeriesValidations;

  @service declare router: any;

  file: Blob | null = null;

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
    if(event.target.value) {
      if(!this.args.show.repeating) {
        this.args.show.recurringInterval = 'week';
      }
    } else {
      this.args.show.recurringInterval = 'not_recurring';
    }
  }

  @action
  onSubmit(result: any, event: any) {
    console.log(result);
    console.log(event);
    this.router.transitionTo('home.show', result);
  }

  @action
  onError() {
    console.log('couldnt ssave show');
  }
}