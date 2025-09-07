import templateOnlyComponent from '@ember/component/template-only';

const EmojiSelectorFruitTipComponent =
  templateOnlyComponent();

export default EmojiSelectorFruitTipComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'EmojiSelector::FruitTip': typeof EmojiSelectorFruitTipComponent;
    'emoji-selector/fruit-tip': typeof EmojiSelectorFruitTipComponent;
  };;;;;;;;;;
}
