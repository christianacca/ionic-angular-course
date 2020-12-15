// note: keysOf is NOT in the lodash library but it should be!
export const keysOf = <T extends {}>(o: T) => Object.keys(o) as Array<keyof T>;