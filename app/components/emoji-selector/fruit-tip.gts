import FruitTip from "../fruit-tip.gts";

const EmojiSelectorFruitTipComponent =
  <template><FruitTip />
</template>;

export default EmojiSelectorFruitTipComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'EmojiSelector::FruitTip': typeof EmojiSelectorFruitTipComponent;
    'emoji-selector/fruit-tip': typeof EmojiSelectorFruitTipComponent;
  }
}
