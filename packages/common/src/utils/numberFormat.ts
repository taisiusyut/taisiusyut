// https://stackoverflow.com/a/14428340
export function numberFormat(num: number | string = '', n = 0) {
  if (!num) return num;
  return Number(num)
    .toFixed(Math.max(0, ~~n))
    .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
}
