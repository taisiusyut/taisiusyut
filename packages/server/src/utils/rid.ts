export const rid = (N = 5): string => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: N }, () =>
    s.charAt(Math.floor(Math.random() * s.length))
  ).join('');
};
