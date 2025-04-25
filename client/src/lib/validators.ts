
/**
 * Validates a Kenyan phone number in various formats:
 * - 07XXXXXXXX
 * - +2547XXXXXXXX
 * - 2547XXXXXXXX
 * 
 * @param phone The phone number to validate
 * @returns Whether the phone number is valid
 */
export const isValidKenyanPhone = (phone: string): boolean => {
  // Remove any whitespace
  const cleanedPhone = phone.trim().replace(/\s+/g, '');
  
  // Check for valid formats
  const localFormat = /^0[17][0-9]{8}$/; // 07XXXXXXXX or 01XXXXXXXX
  const intlFormatWithPlus = /^\+254[17][0-9]{8}$/; // +2547XXXXXXXX or +2541XXXXXXXX
  const intlFormatNoPlus = /^254[17][0-9]{8}$/; // 2547XXXXXXXX or 2541XXXXXXXX
  
  return localFormat.test(cleanedPhone) || 
         intlFormatWithPlus.test(cleanedPhone) || 
         intlFormatNoPlus.test(cleanedPhone);
};

/**
 * Formats a Kenyan phone number to the standard format for API calls: 2547XXXXXXXX
 * 
 * @param phone The phone number to format
 * @returns The formatted phone number
 */
export const formatPhoneForApi = (phone: string): string => {
  // Remove any whitespace
  const cleanedPhone = phone.trim().replace(/\s+/g, '');
  
  // Handle local format: 07XXXXXXXX -> 2547XXXXXXXX
  if (/^0[17][0-9]{8}$/.test(cleanedPhone)) {
    return `254${cleanedPhone.substring(1)}`;
  }
  
  // Handle international format with plus: +2547XXXXXXXX -> 2547XXXXXXXX
  if (/^\+254[17][0-9]{8}$/.test(cleanedPhone)) {
    return cleanedPhone.substring(1);
  }
  
  // Already in the correct format: 2547XXXXXXXX
  if (/^254[17][0-9]{8}$/.test(cleanedPhone)) {
    return cleanedPhone;
  }
  
  // If we reach here, the phone number is invalid
  throw new Error("Invalid phone number format");
};
