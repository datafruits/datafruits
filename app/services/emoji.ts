import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { registerEmoji } from 'datafruits13/emojiStrategy';

export interface EmojiMetadata {
  id: string;
  name: string;
  category: string;
  tags: string[];
  file: string;
  animated?: boolean;
}

export default class EmojiService extends Service {
  private static _current?: EmojiService;

  static get current(): EmojiService {
    if (!EmojiService._current) {
      EmojiService._current = new EmojiService();
    }
    return EmojiService._current;
  }

  @tracked emojiMap = new Map<string, EmojiMetadata>();
  @tracked manifest: EmojiMetadata[] = [];
  @tracked isLoaded = false;
  basePath = '/emoji-zone';

  constructor() {
    super(...arguments);
    if (!EmojiService._current) {
      EmojiService._current = this;
    }
    void this.loadManifest();
  }

  async loadManifest() {
    try {
      const response = await fetch(`${this.basePath}/manifest.json`);
      if (!response.ok) {
        console.error(`[Emoji] Failed to fetch manifest: ${response.status}`);
        return;
      }

      const manifest: EmojiMetadata[] = await response.json();
      const map = new Map<string, EmojiMetadata>();

      manifest.forEach((emoji) => {
        if (emoji.name) {
          map.set(emoji.name.toLowerCase(), emoji);
        }
        if (emoji.file) {
          const fileBase = emoji.file.replace(/\.[^/.]+$/, '').toLowerCase();
          map.set(fileBase, emoji);
        }

        if (emoji.name && emoji.id) {
          registerEmoji(emoji.name, {
            unicode: emoji.id,
            keywords: emoji.tags,
            animated: emoji.animated,
            file: emoji.file,
          });
        }
      });

      // Assign tracked properties together so Glimmer detects the batch update cleanly
      this.manifest = manifest;
      this.emojiMap = map;
      this.isLoaded = true;

      console.log(`[Emoji] Successfully loaded ${manifest.length} emojis from manifest.`);
    } catch (e) {
      console.error('[Emoji] Failed to load emoji manifest', e);
    }
  }

  @action
  urlFor(name: unknown): string {
    if (!name || typeof name !== 'string') {
      return '';
    }
    const cleanName = name.replace(/^:|:$/g, '').toLowerCase();
    const emoji = this.emojiMap.get(cleanName);

    if (emoji) {
      return `${this.basePath}/${emoji.file}`;
    }

    // Return empty string for unmapped or misspelled shortcodes to prevent 404s
    return '';
  }

  @action
  htmlFor(name: unknown, className = 'inline-emoji'): string {
    const url = this.urlFor(name);
    if (!url) return '';
    const cleanName = typeof name === 'string' ? name.replace(/^:|:$/g, '') : 'emoji';

    // Single source of truth for emoji <img> tag markup
    return `<img src="${url}" alt=":${cleanName}:" title=":${cleanName}:" class="${className}" />`;
  }
}
