export function addISODuration(date: Date, duration: string): Date {
  const regex = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?$/;
  const match = duration.match(regex);

  if (!match) throw new Error('Invalid ISO 8601 duration format');

  const [, years, months, weeks, days] = match.map((v) =>
    parseInt(v || '0', 10),
  );

  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  result.setMonth(result.getMonth() + months);
  result.setDate(result.getDate() + weeks * 7 + days);

  return result;
}

export function isDateValidByShelfLife(
  expirationDate: string | Date,
  minimumShelfLife: string,
): boolean {
  const date = new Date(expirationDate);
  const now = new Date();

  const futureCutoff = addISODuration(now, minimumShelfLife);

  return date > futureCutoff;
}
