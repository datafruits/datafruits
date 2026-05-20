export default function getEmojiOwnerId(emoji) {
  return String(emoji?.user?.id ?? emoji?.belongsTo?.('user')?.id?.() ?? '');
}
