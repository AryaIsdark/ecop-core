export type CurrencyCode = 'EUR' | 'USD' | 'SEK' | 'GBP';

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  const base = 'EUR';

  const rates: Record<CurrencyCode, number> = {
    EUR: 1,
    USD: 1.08,
    SEK: 11.2,
    GBP: 0.85,
  };

  if (from === to) return amount;

  if (!rates[from]) throw new Error(`Missing rate for ${from}`);
  if (!rates[to]) throw new Error(`Missing rate for ${to}`);

  // Convert -> base -> target
  const amountInBase = from === base ? amount : amount / rates[from];
  return to === base ? amountInBase : amountInBase * rates[to];
}
