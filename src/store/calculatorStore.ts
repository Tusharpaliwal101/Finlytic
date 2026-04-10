import { create } from 'zustand';
import { 
  SIPResult, SWPResult, LumpsumResult, GoalResult, 
  CAGRResult, InflationResult, RetirementResult 
} from '../types';

interface CalculatorState {
  sipResult: SIPResult | null;
  swpResult: SWPResult | null;
  lumpsumResult: LumpsumResult | null;
  goalResult: GoalResult | null;
  cagrResult: CAGRResult | null;
  infResult: InflationResult | null;
  retirementResult: RetirementResult | null;
  
  taxState: {
    sip: boolean;
    swp: boolean;
    retirement: boolean;
  };
  
  mcState: {
    sip: boolean;
    swp: boolean;
    retirement: boolean;
  };

  setSIPResult: (res: SIPResult) => void;
  setSWPResult: (res: SWPResult) => void;
  setLumpsumResult: (res: LumpsumResult) => void;
  setGoalResult: (res: GoalResult) => void;
  setCAGRResult: (res: CAGRResult) => void;
  setInfResult: (res: InflationResult) => void;
  setRetirementResult: (res: RetirementResult) => void;
  
  toggleTax: (type: 'sip' | 'swp' | 'retirement') => void;
  toggleMC: (type: 'sip' | 'swp' | 'retirement') => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  sipResult: null,
  swpResult: null,
  lumpsumResult: null,
  goalResult: null,
  cagrResult: null,
  infResult: null,
  retirementResult: null,
  
  taxState: { sip: false, swp: false, retirement: false },
  mcState: { sip: false, swp: false, retirement: false },

  setSIPResult: (sipResult) => set({ sipResult }),
  setSWPResult: (swpResult) => set({ swpResult }),
  setLumpsumResult: (lumpsumResult) => set({ lumpsumResult }),
  setGoalResult: (goalResult) => set({ goalResult }),
  setCAGRResult: (cagrResult) => set({ cagrResult }),
  setInfResult: (infResult) => set({ infResult }),
  setRetirementResult: (retirementResult) => set({ retirementResult }),

  toggleTax: (type) => set((state) => ({
    taxState: { ...state.taxState, [type]: !state.taxState[type] }
  })),
  
  toggleMC: (type) => set((state) => ({
    mcState: { ...state.mcState, [type]: !state.mcState[type] }
  })),
}));
