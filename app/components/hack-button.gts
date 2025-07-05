import t from "ember-intl/helpers/t";

const HackButtonComponent =
  <template><a href="https://github.com/datafruits" target="_blank" rel="noreferrer noopener" ...attributes class="cool-button hack text-shadow">
  {{t "hack.title"}}
</a>
</template>;

export default HackButtonComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'HackButton': typeof HackButtonComponent;
    'hack-button': typeof HackButtonComponent;
  }
}
