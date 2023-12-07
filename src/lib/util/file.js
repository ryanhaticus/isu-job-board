export const downloadBase64Resume = (base64) => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const file = new Blob([byteArray], { type: 'application/pdf' });

  const fileURL = URL.createObjectURL(file);

  window.open(fileURL, '_blank');
};
