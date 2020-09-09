'use strict';

module.exports = function (/* environment, appConfig */) {
  // See https://zonkyio.github.io/ember-web-app for a list of
  // supported properties

  return {
    name: 'datafruits.fm',
    short_name: 'datafruits',
    description:
      "Datafruits is a netradio and label founded in 2012 by Tony Miller (mcfiredrill). Its mission is to bring you the world's strangest sounds and bring together the music communities around the world.",
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/assets/images/logo.png',
        sizes: '50x50',
      },
      {
        src: '/assets/favicon.ico',
        sizes: '32x32',
        targets: ['favicon'],
      },
    ],
    ms: {
      tileColor: '#fff',
    },
  };
};
