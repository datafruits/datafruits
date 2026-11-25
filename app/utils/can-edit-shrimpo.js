export function canEditShrimpo(user, shrimpo) {
  return Boolean(user && (
    user.role?.split(/\s+/).includes('admin') ||
    (shrimpo.user?.id
      ? user.id === shrimpo.user.id
      : user.username && user.username === shrimpo.username)
  ));
}
