export const getBase64ImageURL = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL(file.type));
    };

    img.src = URL.createObjectURL(file);
    img.onerror = reject;
  });
};
