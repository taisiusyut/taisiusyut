export function calcWordCount(plainText: string) {
  const regex = /(?:\r\n|\r|\n|\s)/g; // new line, carriage return, line feed
  const cleanString = plainText.replace(regex, '').trim(); // replace above characters w/ space
  return cleanString.length;
}
