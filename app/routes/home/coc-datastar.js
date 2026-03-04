import Route from '@ember/routing/route';

export default class CocDatastarRoute extends Route {
  async beforeModel() {
    await import('@starfederation/datastar/bundles/datastar');
  }
}
