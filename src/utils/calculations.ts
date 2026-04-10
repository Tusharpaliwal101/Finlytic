import { LTCG_RATE, LTCG_EXEMPTION } from '../constants';
import { SIPResult, SWPResult, YearDataRow, SWPYearDataRow } from '../types';

/**
 * Monthly compounding SIP with optional annual step-up
 */
export const runSIPScenario = (
  monthly: number,
  rate: number,
  years: number,
  stepup: number = 0
): SIPResult => {
  let currentMonthly = monthly;
  let balance = 0;
  let totalInvestment = 0;
  const monthlyRate = rate / 100 / 12;
  const yearlyData: YearDataRow[] = [];

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = (balance + currentMonthly) * (1 + monthlyRate);
      totalInvestment += currentMonthly;
    }
    yearlyData.push({
      year,
      totalInvestment,
      returns: balance - totalInvestment,
      balance,
    });
    currentMonthly *= (1 + stepup / 100);
  }

  return {
    totalInvestment,
    totalReturns: balance - totalInvestment,
    totalValue: balance,
    yearlyData,
  };
};

/**
 * Single-redemption LTCG tax calculation
 */
export const calcLTCG_SIP = (corpus: number, invested: number): number => {
  const gain = corpus - invested;
  if (gain <= LTCG_EXEMPTION) return 0;
  return (gain - LTCG_EXEMPTION) * LTCG_RATE;
};

/**
 * Tracks corpus depletion with inflation-indexed SWP
 */
export const runSWPScenario = (
  corpus0: number,
  withdrawal0: number,
  rate: number,
  years: number,
  inflation: number = 0
): SWPResult => {
  let balance = corpus0;
  let currentMonthlyWithdrawal = withdrawal0;
  let totalWithdrawal = 0;
  const monthlyRate = rate / 100 / 12;
  const yearlyData: SWPYearDataRow[] = [];

  for (let year = 1; year <= years; year++) {
    let yearWithdrawal = 0;
    for (let month = 1; month <= 12; month++) {
      if (balance > 0) {
        const withdraw = Math.min(balance, currentMonthlyWithdrawal);
        balance = (balance - withdraw) * (1 + monthlyRate);
        yearWithdrawal += withdraw;
      }
    }
    totalWithdrawal += yearWithdrawal;
    yearlyData.push({
      year,
      totalInvestment: corpus0,
      returns: 0, // Simplified for basic SWP
      balance: Math.max(0, balance),
      withdrawal: yearWithdrawal,
      taxableGain: 0,
      taxPaid: 0,
    });
    currentMonthlyWithdrawal *= (1 + inflation / 100);
  }

  return {
    totalInvestment: corpus0,
    totalWithdrawal,
    finalValue: Math.max(0, balance),
    totalTaxPaid: 0,
    yearlyData,
  };
};

/**
 * Advanced SWP tracking basis and annual tax liability
 */
export const runSWPWithAnnualLTCG = (
  corpus0: number,
  withdrawal0: number,
  rate: number,
  years: number,
  inflation: number = 0,
  basis: number = corpus0
): SWPResult => {
  let currentBalance = corpus0;
  let currentBasis = basis;
  let currentMonthlyWithdrawal = withdrawal0;
  let totalWithdrawal = 0;
  let totalTaxPaid = 0;
  const monthlyRate = rate / 100 / 12;
  const yearlyData: SWPYearDataRow[] = [];

  for (let year = 1; year <= years; year++) {
    let yearWithdrawal = 0;
    let yearTaxableGain = 0;

    for (let month = 1; month <= 12; month++) {
      if (currentBalance > 0) {
        const withdraw = Math.min(currentBalance, currentMonthlyWithdrawal);
        
        // Ratio of gain to corpus
        const gainRatio = (currentBalance - currentBasis) / currentBalance;
        const taxablePortion = Math.max(0, withdraw * gainRatio);
        
        yearTaxableGain += taxablePortion;
        currentBasis -= (withdraw * (1 - gainRatio)); // Reduce basis by principal portion
        currentBalance = (currentBalance - withdraw) * (1 + monthlyRate);
        yearWithdrawal += withdraw;
      }
    }

    // Annual tax calculation with exemption
    const taxPaid = Math.max(0, yearTaxableGain - LTCG_EXEMPTION) * LTCG_RATE;
    totalTaxPaid += taxPaid;
    totalWithdrawal += yearWithdrawal;
    currentBalance -= taxPaid; // Tax comes out of corpus

    yearlyData.push({
      year,
      totalInvestment: corpus0,
      returns: 0,
      balance: Math.max(0, currentBalance),
      withdrawal: yearWithdrawal,
      taxableGain: yearTaxableGain,
      taxPaid,
    });

    currentMonthlyWithdrawal *= (1 + inflation / 100);
  }

  return {
    totalInvestment: corpus0,
    totalWithdrawal,
    finalValue: Math.max(0, currentBalance),
    totalTaxPaid,
    yearlyData,
  };
};

/**
 * Binary search to find required SIP amount
 */
export const calcRequiredSIP = (
  target: number,
  rate: number,
  years: number,
  stepup: number = 0
): number => {
  let low = 0;
  let high = target; // Upper bound safe for any reasonable duration
  let ans = 0;

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const result = runSIPScenario(mid, rate, years, stepup);
    if (result.totalValue >= target) {
      ans = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return ans;
};

/**
 * Sustainability check for retirement corpus
 */
export const calcRetirementTarget = (
  monthlyIncome: number,
  retireReturn: number,
  retireYears: number,
  inflation: number = 0
): number => {
  let low = 0;
  let high = monthlyIncome * 12 * retireYears * 2; // Rough upper estimate
  let ans = high;

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const result = runSWPScenario(mid, monthlyIncome, retireReturn, retireYears, inflation);
    // If we have money left at the end, the corpus was enough
    if (result.finalValue > 0) {
      ans = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return ans;
};
