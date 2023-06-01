export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function base64ToBlob(base64String: string) {
  return fetch(base64String)
    .then((response) => response.blob())
    .then((blob) => new Blob([blob], { type: 'audio/webm' }));
}

export const generateID = () => {
  const timestamp = Date.now();
  const id = (timestamp << 4) | (timestamp & 0xf);
  return id.toString(16);
};
