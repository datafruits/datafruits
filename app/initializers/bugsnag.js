import ENV from "datafruits13/config/environment";

export async function initialize(/* application */) {
  if (typeof FastBoot === 'undefined') {
    const bugsnagModule = await import('@bugsnag/js');

    const bugsnagClient = bugsnagModule.default(ENV.BUGSNAG_KEY);
    if (bugsnagClient) {
      Ember.onerror = function (error) {
        bugsnagClient.notify(error)
      };
    }
  }
}

export default {
  initialize
};
