export const isObject = (obj: { [key: string]: any } = {}): boolean => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
  