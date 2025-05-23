export const formatDate = (date: Date, format: string = 'DD/MM/YYYY'): string => {
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const formatPhoneNumber = (phone: string, country: string = 'US'): string => {
  if (!phone) return '';
  if (phone.length < 10) return phone;

  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    if (country === 'MX') {
      return `+52 (${match[1]}) ${match[2]}-${match[3]}`;
    }
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
}; 