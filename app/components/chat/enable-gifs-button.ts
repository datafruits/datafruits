import Component from "@glimmer/component";

interface ChatEnableGifsButtonSignature {
  Args: {
    enabled: unknown;
    toggleGifs: unknown;
  };
}

export default class EnableGifsButton extends Component<ChatEnableGifsButtonSignature> {}

declare module "@glint/environment-ember-loose/registry" {
  export default interface Registry {
    EnableGifsButton: typeof EnableGifsButton;
  }
}
