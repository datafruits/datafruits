import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

type MultiSelectOption = string | number | boolean | { [key: string]: unknown } | null | undefined;

interface SimpleMultiSelectArgs {
  options?: MultiSelectOption[];
  selected?: MultiSelectOption[];
  placeholder?: string;
  inputId?: string;
  searchPlaceholder?: string;
  loadingText?: string;
  emptyText?: string;
  search?: (_term: string) => Promise<MultiSelectOption[]> | MultiSelectOption[];
  onChange: (_selected: MultiSelectOption[]) => void;
  onCreate?: (_term: string) => Promise<MultiSelectOption | void> | MultiSelectOption | void;
  showCreateWhen?: (_term: string) => boolean;
  optionValue?: (_option: MultiSelectOption) => unknown;
  optionText?: (_option: MultiSelectOption) => string;
}

export default class SimpleMultiSelect extends Component<SimpleMultiSelectArgs> {
  @tracked searchTerm = '';
  @tracked searchedOptions: MultiSelectOption[] | null = null;
  @tracked isLoading = false;

  _requestId = 0;

  get selected() {
    return this.args.selected ?? [];
  }

  get options() {
    if (this.searchedOptions) {
      return this.searchedOptions;
    }

    const options = this.args.options ?? [];
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return options;
    }

    return options.filter((option) => this.optionText(option).toLowerCase().includes(term));
  }

  get showCreateOption() {
    const term = this.searchTerm.trim();
    if (!term || !this.args.onCreate) {
      return false;
    }

    if (this.args.showCreateWhen) {
      return this.args.showCreateWhen(term);
    }

    const lowerTerm = term.toLowerCase();
    return !this.options.some((option) => this.optionText(option).toLowerCase() === lowerTerm);
  }

  @action
  optionText(option: MultiSelectOption): string {
    if (this.args.optionText) {
      return this.args.optionText(option);
    }

    if (typeof option === 'string') {
      return option;
    }

    if (option && typeof option === 'object') {
      const optionObject = option as { name?: string; username?: string };
      const maybeName = optionObject.name ?? optionObject.username;
      if (maybeName) {
        return maybeName;
      }
    }

    if (typeof option === 'number' || typeof option === 'boolean') {
      return `${option}`;
    }

    return '';
  }

  optionValue(option: MultiSelectOption) {
    if (this.args.optionValue) {
      return this.args.optionValue(option);
    }

    if (option && typeof option === 'object' && 'id' in option) {
      return (option as { id: unknown }).id;
    }

    return option;
  }

  @action
  isSelected(option: MultiSelectOption) {
    const targetValue = this.optionValue(option);
    return this.selected.some((selected) => this.optionValue(selected) === targetValue);
  }

  @action
  async search(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    if (!this.args.search) {
      return;
    }

    const requestId = ++this._requestId;
    this.isLoading = true;
    try {
      const result = await this.args.search(value);
      if (requestId === this._requestId) {
        this.searchedOptions = result ?? [];
      }
    } finally {
      if (requestId === this._requestId) {
        this.isLoading = false;
      }
    }
  }

  @action
  toggleOption(option: MultiSelectOption) {
    const targetValue = this.optionValue(option);
    const nextSelection = this.selected.filter((selected) => this.optionValue(selected) !== targetValue);

    if (nextSelection.length === this.selected.length) {
      nextSelection.push(option);
    }

    this.args.onChange(nextSelection);
  }

  @action
  removeOption(option: MultiSelectOption) {
    const targetValue = this.optionValue(option);
    this.args.onChange(this.selected.filter((selected) => this.optionValue(selected) !== targetValue));
  }

  @action
  async createOption() {
    if (!this.args.onCreate) {
      return;
    }

    const createdOption = await this.args.onCreate(this.searchTerm.trim());
    if (createdOption !== null && createdOption !== undefined && !this.isSelected(createdOption)) {
      this.args.onChange([...this.selected, createdOption]);
    }
    this.searchTerm = '';
    this.searchedOptions = null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SimpleMultiSelect: typeof SimpleMultiSelect;
  }
}
