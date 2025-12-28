import Component from '@glimmer/component';
import emojiStrategy from '../../emojiStrategy';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class EmojiSelectorEmojiComponent extends Component {
  customEmojiOrder = {
    Fruits: [
      /* Tonights starting lineup */
      ':banaynay:',
      ':blueberrinies:',
      ':cabbage:',
      ':canteloper:',
      ':corncobby:',
      ':dragion-fruit:',
      ':lemoner:',
      ':limer:',
      ':orangey:',
      ':peachy:',
      ':pineapplee',
      ':strawbur:',
    ],
    Character: [
      /* Original characters that "primarily" exist on Datafruits */
      ':duckle:',
      ':beamsprout:',
      ':mega_beamsprount:',
      ':snailzone:',
      ':deeyef_hmm:',
      ':deeyef:',
      ':deeyex_hmm:',
      ':deeyex:',
      ':dxdf:',
      ':happytrash:',
      ':iphone_girl:',
      ':miniburger:',
      ':pizzap:',
      ':the_ravers:',
      ':futsu:',
      ':hacker:',
      ':lol_grandpa:',
      ':typing:',
      ':grumby:',
      ':garf:',
      ':trash:',
    ],
    '3D': [
      /* Spinny three-dimensional things */
      ':acid:',
      ':banaynay_spin:',
      ':cereal:',
      ':datafruits:',
      ':freaky_green_spin:',
      ':grumby_spin:',
      ':jambox:',
      ':ksd_spin:',
      ':lemoner_spin:',
      ':pizza_spin:',
    ],
    Shrimp: [
      /* ShrimpshakeCo Assets */
      ':good_beverage:',
      ':shrimpshake:',
      ':shrimpshake_spicy:',
      ':sshrimp:',
      ':sshrimp_clear:',
    ],
    Bigup: [
      /* Encouraging iconography for users to convey appreciation for the DJ */
      ':airhorn:',
      ':blend:',
      ':bomboclart_bart:',
      ':fire2:',
      ':metal_guitar:',
    ],
    Text: [
      /* Messages with embedded text */
      ':anysong:',
      ':thanks:',
      ':tune:',
      ':viz:',
      ':glop:',
      ':glorp:',
    ],

    Face: [
      /* Random faces */
      ':bgs:',
      ':bgs_pog:',
      ':lain_dad:',
      ':krango:',
      ':ovenrake:',
      ':php_ceo:',
      ':pensive_booty:',
      ':pricemaster:',
      ':alligottadoisfindthemustard:',
      ':greasyhotdogs:',
      ':sorrymustabeentheonionsaladdressing:',
      ':thisisamazing:',
    ],
    Meme: [
      /* Deep lore */
      ':cheese_teen:',
      ':datafruits_bag:',
      ':gorge:',
      ':lemoner_real:',
      ':mango_hd:',
      ':pickles:',
      ':salad_dressing:',
      ':thanksbill:',
      ':trekkie:',
      ':smiling_shrimp:',
    ],
  };
  widthValues = {
    S: 24,
    M: 36,
    L: 48,
    XL: 60,
    XXL: 72,
  };

  @tracked emojis = emojiStrategy;
  @tracked width = 36;

  @service chat;

  get groupedEmojiOptions() {
    const allEmojis = emojiStrategy;
    const groupedEmojis = [];

    const recentEmojis = this.chat.recentEmojis.map((shortname) => allEmojis[`:${shortname}:`]);
    groupedEmojis.push({groupName: 'Recent', emojis: recentEmojis});

    for (const groupName of Object.keys(this.customEmojiOrder)) {
      const shortnames = this.customEmojiOrder[groupName];
      const emojis = shortnames
        .map((shortname) => {
          return allEmojis[shortname];
        })
        .filter((emoji) => emoji !== undefined);

      groupedEmojis.push({ groupName, emojis });
    }

    return groupedEmojis;
  }

  @action
  sizeChange(event) {
    console.log(event);
    this.width = event.target.value;
    localStorage.setItem('emojiWidth', this.width);
  }

  @action
  sendEmoji(shortname) {
    this.args.sendEmoji(shortname);
    const element = document.getElementsByClassName(shortname)[0];
    element.classList.remove('bounce');
    // https://css-tricks.com/restart-css-animation/
    void element.offsetWidth;
    element.classList.add('bounce');
  }

  @action
  didInsert() {
    this.width = parseInt(localStorage.getItem('emojiWidth')) || 36;
  }
}
