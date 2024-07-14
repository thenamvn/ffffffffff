// utils/upload.js
export function uploadFile(formData) {
    return fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => data.fileUrls)
      .catch((err) => {
        console.error('Error in uploading:', err);
        throw err;
      });
  }
  