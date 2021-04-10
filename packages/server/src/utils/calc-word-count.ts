export function calcWordCount(plainText: string) {
  const cleanString = plainText
    .replace(/\[.*\].*\[\/.*\]/g, '') // remove tag
    .replace(/(?:\r\n|\r|\n|\s)/g, '') // remove new line, carriage return, line feed
    .trim(); // replace above characters w/ space
  return cleanString.length;
}
