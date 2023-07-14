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

interface UserShowFormArgs {
  show: ShowSeries;
}

export default class UserShowForm extends Component<UserShowFormArgs> {
  ShowSeriesValidations = ShowSeriesValidations;

  @service declare router: any;
  @service declare store: any;

  file: Blob | null = null;

  @tracked users: User[] = [];
  @tracked errors: { [key: string]: string[] } = {};

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
  searchDjs(term: string) {
    return new Promise((resolve, reject) => {
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
    return (new Date()).toISOString().split("T")[0]
  }
}
