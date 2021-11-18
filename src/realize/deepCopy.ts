function isObject(source: any): boolean {
  return source != null && typeof source === 'object';
}

export function deepCopy<T>(source: any, map = new Map()): T {
  if (!isObject(source)) return source;
  if (map.has(source)) return map.get(source);
  const target: any = Array.isArray(source) ? [] : {};
  map.set(source, target);
  // Symbol
  const symbolKey = Object.getOwnPropertySymbols(source);

  if (symbolKey.length) {
    symbolKey.forEach(key => {
      if (isObject(source[key])) {
        target[key] = deepCopy(source[key], map);
      } else {
        target[key] = source[key];
      }
    });
  }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (isObject(source[key])) {
        target[key] = deepCopy(source[key], map);
      } else {
        target[key] = source[key];
      }
    }
  }

  return target;
}
