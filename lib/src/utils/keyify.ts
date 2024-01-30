export default function keyify(object: Record<string, unknown>, prefix: unknown[] = []): string[] {
  const result: string[] = [];

  for (const [element, value] of Object.entries(object)) {
    if (!Array.isArray(value)) {
      if (typeof value === "object" && value !== null) {
        prefix.push(element);
        const keys = keyify(value as Record<string, unknown>, prefix);
        prefix.pop();

        result.push(...keys);
      } else {
        const finalPrefix = prefix.length ? prefix.join(".") + "." : "";
        result.push(finalPrefix + element);
      }
    }
  }

  return result;
}
