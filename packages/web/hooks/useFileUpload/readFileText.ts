export async function readFileAsArrayBuffer(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer instanceof ArrayBuffer) {
        resolve(arrayBuffer);
      } else {
        reject(`expect "ArrayBuffer" but receive ${typeof arrayBuffer}`);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function readFileAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const text = event.target?.result;
      if (typeof text === 'string') {
        resolve(text);
      } else {
        reject(`expect "string" but receive ${typeof text}`);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function extractDocxRawText(file: File) {
  const { default: mammoth } = await import('mammoth');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.replace(/\n\n/g, '\n');
}

export async function readFileText(file: File) {
  const [filename, ...rest] = file.name.split('.');
  const fileExtension = rest.slice(-1)[0];

  const content =
    fileExtension === 'docx'
      ? await extractDocxRawText(file)
      : await readFileAsText(file);

  return { name: filename, content };
}
