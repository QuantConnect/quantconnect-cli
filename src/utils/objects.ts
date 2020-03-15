export function mutateObjectRecursively(obj: any, replacer: (key: string, value: any) => any): void {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object') {
      mutateObjectRecursively(obj[key], replacer);
    } else {
      obj[key] = replacer(key, obj[key]);
    }
  }
}
