import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CurrentUserService from 'datafruits13/services/current-user';

interface UserFavoritesArgs {}

export default class UserFavorites extends Component<UserFavoritesArgs> {
  @service declare currentUser: CurrentUserService;
}
