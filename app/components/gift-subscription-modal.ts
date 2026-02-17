import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type Store from '@ember-data/store';
import type ChatService from 'datafruits13/services/chat';
import type GiftSubscription from 'datafruits13/models/gift-subscription';

interface GiftSubscriptionModalSignature {
  Args: {
    toggleModal: () => void;
  };
}

export default class GiftSubscriptionModal extends Component<GiftSubscriptionModalSignature> {
  @service declare store: Store;
  @service declare chat: ChatService;

  @tracked selectedQuantity: number = 1;
  @tracked searchUsername: string = '';
  @tracked errorMessage: string = '';
  @tracked isSubmitting: boolean = false;

  quantityOptions = [1, 5, 10, 20];

  get showUserSearch(): boolean {
    return this.selectedQuantity === 1;
  }

  get filteredUsers(): string[] {
    if (!this.searchUsername) {
      return [];
    }
    const searchTerm = this.searchUsername.toLowerCase();
    return Object.keys(this.chat.presences)
      .filter(username => username.toLowerCase().includes(searchTerm))
      .slice(0, 10);
  }

  @action
  selectQuantity(quantity: number) {
    this.selectedQuantity = quantity;
    if (quantity !== 1) {
      this.searchUsername = '';
    }
  }

  @action
  updateSearchUsername(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchUsername = target.value;
  }

  @action
  selectUser(username: string) {
    this.searchUsername = username;
  }

  @action
  async purchaseGiftSubscriptions(event: Event) {
    event.preventDefault();
    
    this.errorMessage = '';
    this.isSubmitting = true;

    try {
      const giftSubscription = this.store.createRecord('gift-subscription', {
        quantity: this.selectedQuantity,
        recipientUsername: this.selectedQuantity === 1 && this.searchUsername ? this.searchUsername : null,
      }) as GiftSubscription;

      await giftSubscription.save();
      
      this.args.toggleModal();
    } catch (error: any) {
      console.error('Error purchasing gift subscriptions:', error);
      this.errorMessage = error?.errors?.[0]?.detail || 'Failed to purchase gift subscriptions. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    GiftSubscriptionModal: typeof GiftSubscriptionModal;
  }
}
