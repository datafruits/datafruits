# datafruits Custom Framework

A lightweight, purpose-built framework replacing Ember.js and Ember Data in the
datafruits frontend application.

## Why?

Ember.js and Ember Data add significant bundle weight and conceptual overhead
for a site like datafruits.fm. This custom framework is intentionally minimal
and exposes only the primitives the app actually needs.

## Architecture

```
framework/
├── index.ts       – barrel export
├── app.ts         – application bootstrap (createApp)
├── model.ts       – base Model class + attr/belongsTo/hasMany decorators
├── store.ts       – JSON:API identity-map store (replaces Ember Data store)
├── api.ts         – fetch-based HTTP client (replaces @ember-data/adapter)
├── adapter.ts     – URL-building adapter registry (replaces adapter classes)
├── normalizer.ts  – response normalizer registry (replaces serializers)
├── auth.ts        – session/authentication service (replaces ember-simple-auth)
├── service.ts     – service container + BaseService + @service decorator
├── reactive.ts    – reactive state: @tracked decorator + Signal primitive
└── router.ts      – History API client-side router (replaces EmberRouter)
```

## Key Concepts

### Models

```ts
import { Model, attr, hasMany, registerModel } from 'framework';

class ShowSeries extends Model {
  @attr() declare title: string;
  @attr() declare slug: string;
  @hasMany('scheduled-show') declare episodes: ScheduledShow[];
}

registerModel('showSeries', ShowSeries);
```

### Store

```ts
import { Store } from 'framework';

const store = new Store({ host: ENV.API_HOST, getToken: () => auth.token });

// fetch records
const shows = await store.findAll<ShowSeries>('showSeries');
const show  = await store.findRecord<ShowSeries>('showSeries', 42);

// create / save / delete
const newShow = store.createRecord<ShowSeries>('showSeries', { title: 'My Show' });
await store.saveRecord(newShow);
await store.deleteRecord(newShow);
```

### Authentication

```ts
import { AuthService } from 'framework';

const auth = new AuthService({ apiHost: ENV.API_HOST });

await auth.signIn({ login: 'user@example.com', password: 'secret' });
auth.isAuthenticated; // true
auth.token;           // 'Bearer …'

auth.onChange((session) => { /* session changed */ });
await auth.signOut();
```

### Reactive State

```ts
import { tracked, signal } from 'framework';

class Counter {
  @tracked count = 0;
  increment() { this.count++; }
}

// standalone signal
const name = signal('world');
name.value = 'datafruits';
name.subscribe(() => console.log('name changed to', name.value));
```

### Services

```ts
import { container, BaseService, service } from 'framework';

class MyService extends BaseService {
  @service('store') declare store: Store;
  doSomething() { return this.store.findAll('show'); }
}

container.register('myService', () => new MyService());
const svc = container.lookup<MyService>('myService');
```

### Router

```ts
import { setupRouter } from 'framework';

const router = setupRouter([
  { name: 'home', path: '/' },
  { name: 'shows', path: '/shows', children: [
    { name: 'show', path: '/:slug' },
  ]},
  { name: 'not-found', path: '/*path' },
]);

router.onChange((match) => {
  if (match) renderRoute(match.name, match.params);
});

router.start();
router.transitionTo('shows.show', { slug: 'my-show' });
```

### App Bootstrap

```ts
import { createApp } from 'framework';
import { routes } from './router';

const app = createApp({
  apiHost: 'https://streampusher.com',
  socketUrl: 'wss://streampusher.com/socket',
  routes,
});

app.start();
```

## Migration Status

The data layer (models, adapters, serializers, services) has been migrated to
the custom framework.  The Ember.js template/component layer is still in use
during the incremental migration.  Once Glimmer components are replaced with
Web Components or a lighter view layer, `ember-source` can be removed.

| Layer | Status |
|-------|--------|
| Models (`@ember-data/model`) | ✅ Migrated to `framework/model.ts` |
| Store (`ember-data/store`) | ✅ Migrated to `framework/store.ts` |
| Adapters (`@ember-data/adapter`) | ✅ Migrated to `framework/adapter.ts` |
| Serializers (`@ember-data/serializer`) | ✅ Migrated to `framework/normalizer.ts` |
| Auth (`ember-simple-auth`) | ✅ Migrated to `framework/auth.ts` |
| Services (`@ember/service`) | ✅ Migrated to `framework/service.ts` |
| Routing (`@ember/routing`) | 🔄 Framework router ready; template routing in progress |
| Templates / Components | 🔄 Still using Ember/Glimmer; migration in progress |
