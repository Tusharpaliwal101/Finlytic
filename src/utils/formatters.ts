export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompact = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};
