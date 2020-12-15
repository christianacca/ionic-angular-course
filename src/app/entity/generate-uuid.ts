// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid/2117523#2117523
// to-do:
// crypto method not supported by jest will use below method https://github.com/jsdom/jsdom/issues/1612
// 6412 - create message card
export const generateUUId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // tslint:disable-next-line: no-bitwise
    const r = (Math.random() * 16) | 0,
      // tslint:disable-next-line: no-bitwise
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
