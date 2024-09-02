import Tesseract from 'tesseract.js';

export const recognizeText = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    );
    return result.data;
  } catch (err) {
    console.error('OCR Error:', err);
    return null
  }
};
