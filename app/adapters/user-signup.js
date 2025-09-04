import ApplicationAdapter from './application';

export default class UserSignupAdapter extends ApplicationAdapter {
  namespace = 'api/admin';
  
  buildURL() {
    return `${this.host}/${this.namespace}/user_signups.json`;
  }
}