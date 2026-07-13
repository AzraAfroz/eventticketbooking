const crypto = require('crypto');

/**
 * Generates a unique ticket number
 * Format: TKT-YYYYMMDD-[6 RANDOM HEX CHARACTERS]
 * @returns {string}
 */
const generateTicketNumber = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const dateString = `${year}${month}${day}`;
  const uniqueId = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  return `TKT-${dateString}-${uniqueId}`;
};

module.exports = {
  generateTicketNumber
};
