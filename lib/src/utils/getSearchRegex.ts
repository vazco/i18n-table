import escapeRegExp from "lodash.escaperegexp";

export default function getSearchRegex(search: string, exact = false) {
  const regex = escapeRegExp(exact ? `^${search}$` : search);
  return new RegExp(regex, "i");
}
