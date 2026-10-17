import { helper } from '@ember/component/helper';
import { getOwner } from '@ember/application';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';

export function emojiPath([name]: [string], _named?: Record<string, unknown>, hash?: Record<string, unknown>): string {
  if (!name) return '';
  const cleanName = name.replace(/^:|:$/g, '');
  
  const owner = getOwner(hash) || getOwner(_named);
  const emojiZone = owner ? (owner.lookup('service:emoji-zone') as EmojiZoneService | undefined) : undefined;
  
  return emojiZone ? emojiZone.urlFor(cleanName) : `/emoji-zone/${cleanName}.png`;
}

export default helper(emojiPath);