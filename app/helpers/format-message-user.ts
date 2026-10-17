import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';

// Simple HTML escaper to replace Handlebars.Utils.escapeExpression safely
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatMessageUser(
  usernameOrArgs: string | undefined | null | [string | undefined | null]
): SafeString {
  let username = Array.isArray(usernameOrArgs) ? usernameOrArgs[0] : usernameOrArgs;
  if (!username) return htmlSafe('');
  return htmlSafe(escapeHtml(username));
}

export default class FormatMessageUser extends Helper {
  @service('emoji-zone') declare emojiZone: EmojiZoneService;

  compute(params: [string | undefined | null]): SafeString {
    let rawUsername = params[0];
    if (!rawUsername) return htmlSafe('');

    let username = escapeHtml(rawUsername);

    if (this.emojiZone) {
      username = username.replace(/:([a-zA-Z0-9_+-]+):/g, (match: string, name: string) => {
        const generatedHtml = this.emojiZone.htmlFor(name);
        return generatedHtml || match;
      });
    }

    return htmlSafe(username);
  }
}