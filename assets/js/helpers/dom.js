export function hasClass( target, className ) {
  return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
}


