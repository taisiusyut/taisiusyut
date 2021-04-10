const imageRegex = /(\[img\]https:\/\/.*?\[\/img\])/;

export function removeTags(value: string) {
  return value.replace(/\[.*\].*\[\/.*\]/g, '');
}

function split(value: string, regex: RegExp[]): string[] {
  if (regex.length) {
    const [_regex, ...rest] = regex;
    return value
      .split(_regex)
      .reduce(
        (arr, s) => (s ? [...arr, ...split(s, rest)] : arr),
        [] as string[]
      );
  }
  return [value];
}

export function parseChapterContent(content: string) {
  return content
    .split(/\n/)
    .reduce(
      (arr, s) => (s ? [...arr, split(s, [imageRegex])] : arr),
      [] as (string | string[])[]
    );
}
