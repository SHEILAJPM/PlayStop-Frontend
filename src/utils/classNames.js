export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function cxDark(base, darkClass, isDark) {
  return isDark ? base + ' ' + darkClass : base;
}
