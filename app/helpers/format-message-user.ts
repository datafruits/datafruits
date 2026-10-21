import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template';
import type EmojiService from 'datafruits13/services/emoji';

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
  const username = Array.isArray(usernameOrArgs) ? usernameOrArgs[0] : usernameOrArgs;
  if (!username) return htmlSafe('');
  return htmlSafe(escapeHtml(username));
}

export default class FormatMessageUser extends Helper {
  @service declare emoji: EmojiService;

  compute(params: [string | undefined | null]): SafeString {
    const rawUsername = params[0];
    if (!rawUsername) return htmlSafe('');

    let username = escapeHtml(rawUsername);

    if (this.emoji) {
      username = username.replace(/:([a-zA-Z0-9_+-]+):/g, (match: string, name: string) => {
        const generatedHtml = this.emoji.htmlFor(name);
        return generatedHtml || match;
      });
    }

    return htmlSafe(username);
  }
}