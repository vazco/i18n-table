export default function keyify(
  object: Record<string, unknown>,
  prefix: unknown[] = [],
): string[] {
  return Object.keys(object).reduce<string[]>((result, element) => {
    if (Array.isArray(object[element])) {
      return result;
    }

    if (typeof object[element] === 'object' && object[element] !== null) {
      prefix.push(element);
      const keys = keyify(object[element] as Record<string, unknown>, prefix);
      prefix.pop();

      result.push(...keys);
    } else {
      const finalPrefix = prefix.length ? prefix.join('.') + '.' : '';
      result.push(finalPrefix + element);
    }

    return result;
  }, []);
}
