import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import ENV from 'datafruits13/config/environment';

export default class CustomEmojiForm extends Component {
  @service store;
  @service activeStorage;

  @tracked name = '';
  @tracked uploadProgress = 0;
  @tracked imageSignedId = null;
  @tracked isSaving = false;
  @tracked error = '';
  @tracked imagePreviewUrl = null;

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  uploadImage(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.error = 'Please upload a PNG, GIF, JPEG, or WebP image.';
      return;
    }

    this.error = '';
    this.imagePreviewUrl = URL.createObjectURL(file);

    const directUploadURL = `${ENV.API_HOST}/rails/active_storage/direct_uploads`;
    this.activeStorage
      .upload(file, directUploadURL, {
        onProgress: (progress) => {
          this.uploadProgress = progress;
        },
      })
      .then((blob) => {
        this.imageSignedId = blob.signedId;
        this.uploadProgress = 0;
      });
  }

  get isValid() {
    return this.name.trim().length > 0 && this.imageSignedId;
  }

  @action
  async submit(event) {
    event.preventDefault();

    if (!this.isValid || this.isSaving) return;

    this.isSaving = true;
    this.error = '';

    try {
      const emoji = this.store.createRecord('custom-emoji', {
        name: this.name.trim(),
        image: this.imageSignedId,
      });
      await emoji.save();
      this.name = '';
      this.imageSignedId = null;
      this.imagePreviewUrl = null;
      this.uploadProgress = 0;
      if (this.args.onSave) {
        this.args.onSave(emoji);
      }
    } catch {
      this.error = 'Failed to save custom emoji. Please try again.';
    } finally {
      this.isSaving = false;
    }
  }
}
