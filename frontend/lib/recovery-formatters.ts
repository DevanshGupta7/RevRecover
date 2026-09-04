export function normalizePercentage(value: number | string | null | undefined) {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  const percentage = numericValue >= 0 && numericValue <= 1
    ? numericValue * 100
    : numericValue;

  return Math.min(Math.max(percentage, 0), 100);
}

export function formatPercentage(value: number | string | null | undefined) {
  const percentage = normalizePercentage(value);

  return Number.isInteger(percentage)
    ? `${percentage}%`
    : `${percentage.toFixed(1)}%`;
}
