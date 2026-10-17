/** Isolate mutable renderer inputs while reusing unchanged numeric buffers. */
export function numericCopy<T>(value: T, cache: WeakMap<object, unknown>): T {
  if (value === null || typeof value !== 'object') return value;
  if (cache.has(value)) return cache.get(value) as T;
  if (Array.isArray(value)) {
    const copy: unknown[] = []; cache.set(value, copy);
    for (const child of value) copy.push(numericCopy(child, cache));
    return copy as T;
  }
  if (Object.getPrototypeOf(value) === Object.prototype) {
    const copy: Record<string, unknown> = {}; cache.set(value, copy);
    for (const [key, child] of Object.entries(value)) copy[key] = numericCopy(child, cache);
    return copy as T;
  }
  const copy = structuredClone(value); cache.set(value, copy); return copy;
}
