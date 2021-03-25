export function InlineScript({ fn }: { fn: Function | string }) {
  const html =
    typeof fn === 'string'
      ? fn
      : `(${fn.toString().replace(/\/\/.*$/gm, '')})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: html.replace(/ {2}|\n/g, '') }}
    />
  );
}
