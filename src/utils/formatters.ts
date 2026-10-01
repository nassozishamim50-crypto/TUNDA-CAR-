export function formatUgx(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG')}`;
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString('en-UG')} km`;
}

export function cleanPhoneNumber(phone: string): string {
  // Remove non-digit characters except +
  return phone.replace(/[^\d+]/g, '');
}

export function getWhatsAppLink(phone: string, message: string): string {
  let cleaned = cleanPhoneNumber(phone);
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('0')) {
    cleaned = '256' + cleaned.substring(1);
  }
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encodedMsg}`;
}

export function getPhoneLink(phone: string): string {
  return `tel:${cleanPhoneNumber(phone)}`;
}
