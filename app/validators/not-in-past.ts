export default function notInPast() {
  return (key: any, newValue: any , _oldValue: any, _changes: any, content: any): boolean | string => {
    if(content.isNew) {
      const now = new Date();
      if (newValue > now) {
        return true;
      } else {
        return `${key} cannot be in the past`;
      }
    } else {
      return true;
    }
  };
}
