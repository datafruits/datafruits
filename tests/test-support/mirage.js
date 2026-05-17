import { setupMirage as _setupMirage } from 'ember-mirage/test-support';

import mirageConfig from 'datafruits13/mirage/config';

export function setupMirage(hooks, options = {}) {
  options.makeServer = options.makeServer || mirageConfig;

  return _setupMirage(hooks, options);
}
