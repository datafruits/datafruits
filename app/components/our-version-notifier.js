import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class OurVersionNotifier extends Component {
  /** @type {import("ember-cli-new-version/services/new-version").default} */
  @service newVersion;

  @tracked updateMessage =
    this.args.updateMessage ??
    'This application has been updated from version {oldVersion} to {newVersion}. Please save any work, then refresh browser to see changes.';
  @tracked showReload = this.args.showReload ?? true;
  @tracked reloadButtonText = this.args.reloadButtonText ?? 'Reload';

  /**
   * @returns {string | undefined}
   */
  get message() {
    if (this.newVersion.isNewVersionAvailable) {
      return this.updateMessage
        .replace('{oldVersion}', this.newVersion.currentVersion)
        .replace('{newVersion}', this.newVersion.latestVersion);
    }

    return undefined;
  }

  @action
  close() {
    this.newVersion.ignoreVersion(this.newVersion.latestVersion);

    return false;
  }

  @action
  reload() {
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload(true);
    }
  }
}
