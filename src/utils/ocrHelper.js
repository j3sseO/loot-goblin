import Tesseract from 'tesseract.js';

export const recognizeText = (imagePath) => {
  return Tesseract.recognize(
    imagePath,
    'eng',
    {
      logger: (m) => console.log(m), // Progress logging
    }
  )
    .then(({ data: { text } }) => text)
    .catch((err) => {
      console.error('OCR Error: ', err);
      return null;
    });
};
