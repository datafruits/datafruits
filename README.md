# datafruits

[![Build Status](https://github.com/datafruits/datafruits/workflows/CI/badge.svg)](https://github.com/datafruits/datafruits/actions?workflow=CI)

frontend for datafruits application.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (10.x) (with yarn)
* [Ember CLI](https://ember-cli.com/)

## Installation

* `git clone <repository-url>` this repository
* `cd datafruits`
* `yarn install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

If you want to develop against local versions of
[streampusher](https://github.com/streampusher/) or [hotdog
lounge (the chat server)](https://github.com/datafruits/hotdog_lounge) you can
edit these values in the `.env` file, and restart the server.
```
CHAT_SOCKET_URL="wss://localhost:4000/socket"
API_HOST='https://localhost:3000'
```

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
