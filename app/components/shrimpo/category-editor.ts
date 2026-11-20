import Component from '@glimmer/component';
import { action } from '@ember/object';

export interface CategoryDraft {
  id?: string;
  name: string;
  emoji: string;
}

interface CategoryEditorArgs {
  categories: CategoryDraft[];
  onChange: (categories: CategoryDraft[]) => void;
}

export default class ShrimpoCategoryEditor extends Component<CategoryEditorArgs> {
  @action add() {
    this.args.onChange([...this.args.categories, { name: '', emoji: ':sshrimp:' }]);
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
