const QRCode = require('qrcode');
const logger = require('./logger');

const generateQRCode = async (data) => {
  try {
    // Generate data URL for the given data
    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
    return await QRCode.toDataURL(stringifiedData);
  } catch (error) {
    logger.error('QR Code generation error: %o', error);
    throw error;
  }
};

module.exports = {
  generateQRCode
};
