import classic from 'ember-classic-decorator';
import Devise from 'ember-simple-auth/authenticators/devise';
import ENV from 'datafruits13/config/environment';

@classic
export default class _Devise extends Devise {
  serverTokenEndpoint = `${ENV.API_HOST}/users/sign_in`;
  identificationAttributeName = 'login';
}
