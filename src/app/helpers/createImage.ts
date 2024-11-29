/**
 * Converts a URL or base64 image into an HTMLImageElement.
 * @param {string} src - The source of the image (URL or base64).
 * @returns {Promise<HTMLImageElement>} A promise that resolves to the image element.
 */
export const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous"; // This helps to avoid CORS issues when loading external images.
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};
