export default function keyify(
  object: Record<string, unknown>,
  prefix = '',
): string[] {
  return Object.keys(object).reduce((result: string[], element: string) => {
    if (Array.isArray(object[element])) {
      return result;
    } else if (
      typeof object[element] === 'object' &&
      object[element] !== null
    ) {
      return [
        ...result,
        ...keyify(
          object[element] as Record<string, unknown>,
          prefix + element + '.',
        ),
      ];
    }
    return [...result, prefix + element];
  }, []);
}
