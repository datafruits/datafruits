export function canEditShrimpo(user, shrimpo) {
  return Boolean(user && (
    user.role?.split(/\s+/).includes('admin') ||
    (user.id && user.id === shrimpo.user?.id)
  ));
}
