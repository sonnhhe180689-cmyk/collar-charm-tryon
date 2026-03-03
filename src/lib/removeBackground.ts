/**
 * Remove white/light background from an image by making those pixels transparent.
 * Returns a data URL of the processed PNG image.
 */
export const removeWhiteBackground = (
  imageSrc: string,
  threshold: number = 230
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // If pixel is white/near-white, make it transparent
        if (r >= threshold && g >= threshold && b >= threshold) {
          data[i + 3] = 0; // fully transparent
        }
        // Soften edges: semi-light pixels get partial transparency
        else if (r >= threshold - 30 && g >= threshold - 30 && b >= threshold - 30) {
          const avg = (r + g + b) / 3;
          const alpha = Math.max(0, 255 - ((avg - (threshold - 30)) / 30) * 255);
          data[i + 3] = Math.round(alpha);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject('Failed to load image');
    img.src = imageSrc;
  });
};
