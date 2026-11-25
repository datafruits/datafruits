import Component from '@glimmer/component';
import { action } from '@ember/object';

export interface CategoryDraft {
  key: string;
  id?: string;
  name: string;
  emoji: string;
}

interface CategoryEditorArgs {
  categories: CategoryDraft[];
  disabled?: boolean;
  onChange: (categories: CategoryDraft[]) => void;
}

export default class ShrimpoCategoryEditor extends Component<CategoryEditorArgs> {
  private nextDraftId = 0;

  @action add() {
    const draft = { key: `draft-${this.nextDraftId++}`, name: '', emoji: ':sshrimp:' };
    this.args.onChange([...this.args.categories, draft]);
  }

  @action remove(index: number) {
    this.args.onChange(this.args.categories.filter((_, i) => i !== index));
  }

  update(index: number, field: 'name' | 'emoji', value: string) {
    this.args.onChange(this.args.categories.map((category, i) =>
      i === index ? { ...category, [field]: value } : category
    ));
  }

  @action updateName(index: number, event: Event) {
    this.update(index, 'name', (event.target as HTMLInputElement).value);
  }

  @action updateEmoji(index: number, emoji: string) {
    this.update(index, 'emoji', emoji);
  }
}
