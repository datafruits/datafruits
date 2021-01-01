import fetch from 'fetch';
import { Promise } from 'rsvp';
import ENV from 'datafruits13/config/environment';

const host = ENV.API_HOST;

export default function uniqueEmail(/* options = {} */) {
  return (key, newValue) => {
    return new Promise((resolve) => {
      fetch(`${host}/api/listeners/validate_email?email=${newValue}`)
        .then((response) => {
          response.json().then((json) => {
            if (json.valid === true) {
              resolve(true);
            } else {
              resolve('Account with this email already exists.');
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
}
