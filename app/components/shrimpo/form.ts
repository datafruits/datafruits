import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import type Shrimpo from 'datafruits13/models/shrimpo';

interface ShrimpoFormArgs {
  model: Shrimpo;
}

export default class ShrimpoForm extends Component<ShrimpoFormArgs> {
  lengths = [
    '1 hour',
    '2 hours',
    '4 hours',
    '1 day',
    '2 days',
    '1 week'
  ];
  @service declare router: RouterService;

  @action
  onSubmit(data: any, event: Event) {
    console.log(data);
    console.log(event);
    this.router.transitionTo('home.shrimpo.show', data.slug);
  }

  @action
  onError() {
    alert("Couldn't save shrimpo...check the form for errors.");
  }
}
