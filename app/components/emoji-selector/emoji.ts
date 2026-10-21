import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import EmojiZoneService from 'datafruits13/services/emoji-zone';
import type ChatService from 'datafruits13/services/chat';

interface EmojiSelectorEmojiArgs {
  sendEmoji: (shortname: string) => void;
}

export default class EmojiSelectorEmojiComponent extends Component<EmojiSelectorEmojiArgs> {
  priorityCategories = ['Datafruits', 'Character', 'Food', 'Fruit', 'Drink'];

  widthValues = {
    S: 24,
    M: 36,
    L: 48,
    XL: 60,
    XXL: 72,
  };

  @tracked width = 36;
  @service declare chat: ChatService;
  @service('emoji-zone') declare emojiZone: EmojiZoneService;

  get groupedEmojiOptions() {
    const emojiZone = this.emojiZone;
    
    if (!emojiZone.isLoaded) {
      return [];
    }

    const allManifest = emojiZone.manifest || [];
    const groupedEmojis = [];

    // 1. Recent emojis group
    const recentEmojis = (this.chat.recentEmojis || [])
      .map((shortname) => {
        const clean = shortname.replace(/^:|:$/g, '').toLowerCase();
        const meta = emojiZone.emojiMap.get(clean);
        if (!meta) return null;
        return {
          shortname: `:${meta.name}:`,
          file: meta.file,
          url: emojiZone.urlFor(meta.name),
        };
      })
      .filter(Boolean);

    groupedEmojis.push({ groupName: 'Recent', emojis: recentEmojis });

    // 2. Extract all unique categories present in the manifest
    const categorySet = new Set(allManifest.map((e) => e.category).filter(Boolean));

    const sortedCategories = Array.from(categorySet).sort((a, b) => {
      const indexA = this.priorityCategories.indexOf(a);
      const indexB = this.priorityCategories.indexOf(b);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    // 3. Build group objects dynamically matching template expectations
    for (const groupName of sortedCategories) {
      const items = allManifest
        .filter((emoji) => emoji.category && emoji.category.toLowerCase() === groupName.toLowerCase())
        .map((emoji) => ({
          shortname: `:${emoji.name}:`,
          file: emoji.file,
          url: emojiZone.urlFor(emoji.name),
        }));

      if (items.length > 0) {
        groupedEmojis.push({ groupName, emojis: items });
      }
    }

    return groupedEmojis;
  }

  @action
  sizeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.width = parseInt(target.value, 10);
    localStorage.setItem('emojiWidth', String(this.width));
  }

  @action
  sendEmoji(shortname: string) {
    this.args.sendEmoji(shortname);
    const cleanClass = shortname.replace(/^:|:$/g, '');
    const element = document.getElementsByClassName(cleanClass)[0] as HTMLElement;
    if (element) {
      element.classList.remove('bounce');
      void element.offsetWidth;
      element.classList.add('bounce');
    }
  }

  @action
  didInsert() {
    this.width = parseInt(localStorage.getItem('emojiWidth') || '36', 10);
  }
}