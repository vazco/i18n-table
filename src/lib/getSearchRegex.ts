export default function getSearchRegex(search: string, exact = false) {
  return new RegExp(exact ? `^${search}$` : search, 'i');
}
