import ApplicationSerializer from './application';

const editableAttributes = [
  'title',
  'startAt',
  'endAt',
  'rulePack',
  'duration',
  'coverArt',
  'zip',
  'emoji',
];

export default class ShrimpoSerializer extends ApplicationSerializer {
  serialize(snapshot, options) {
    const payload = super.serialize(snapshot, options);

    if (!snapshot.record.isNew) {
      const changed = snapshot.changedAttributes();
      const attributes = {};

      for (const attribute of editableAttributes) {
        const key = this.keyForAttribute(attribute);
        if (Object.hasOwn(changed, attribute) && Object.hasOwn(payload.data.attributes, key)) {
          attributes[key] = payload.data.attributes[key];
        }
      }

      payload.data.attributes = attributes;
      delete payload.data.relationships;
    }

    return payload;
  }
}
