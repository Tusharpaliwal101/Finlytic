export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface YearDataRow {
  year: number;
  totalInvestment: number;
  returns: number;
  balance: number;
}

export interface SWPYearDataRow extends YearDataRow {
  withdrawal: number;
  taxableGain: number;
  taxPaid: number;
}

export interface SIPResult {
  totalInvestment: number;
  totalReturns: number;
  totalValue: number;
  yearlyData: YearDataRow[];
}

export interface SWPResult {
  totalInvestment: number;
  totalWithdrawal: number;
  finalValue: number;
  totalTaxPaid: number;
  yearlyData: SWPYearDataRow[];
}

export interface LumpsumResult {
  totalInvestment: number;
  totalReturns: number;
  totalValue: number;
  yearlyData: YearDataRow[];
}

export interface GoalResult {
  monthlyRequired: number;
  totalValue: number;
  isAchievable: boolean;
  yearlyData: YearDataRow[];
}

export interface CAGRResult {
  cagr: number;
  totalReturn: number;
  absoluteReturn: number;
}

export interface InflationResult {
  futureValue: number;
  purchasingPower: number;
  yearlyData: YearDataRow[];
}

export interface RetirementResult {
  corpusRequired: number;
  monthlySavingsRequired: number;
  retirementYear: number;
  yearlyData: YearDataRow[];
}

export interface Policy {
  id?: string;
  name: string;
  description: string;
  type: string;
  data: any;
  effectiveDate: string;
}

export interface TaxState {
  income: number;
  deductions: number;
  regime: 'old' | 'new';
  taxPayable: number;
}

export interface MCState {
  calculators: string[];
  activeCalculator: string;
  history: any[];
}
